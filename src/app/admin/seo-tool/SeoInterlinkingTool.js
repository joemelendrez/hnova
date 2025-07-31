'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Link, Target, TrendingUp, FileText, Copy, CheckCircle, Bot, Lightbulb, Zap, MessageSquare, AlertCircle, RefreshCw, Send } from 'lucide-react';

const SeoInterlinkingTool = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedLinks, setCopiedLinks] = useState(new Set());
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Load posts from WordPress
  const loadPosts = async () => {
    setPostsLoading(true);
    
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
      
      if (!wpUrl || wpUrl === 'https://your-wordpress-site.com/graphql') {
        throw new Error('WordPress URL not configured');
      }
      
      const query = `
        query GetAllPosts {
          posts(first: 100, where: { status: PUBLISH }) {
            edges {
              node {
                id
                title
                slug
                excerpt
                content
                date
                categories {
                  edges {
                    node {
                      name
                      slug
                    }
                  }
                }
                acfBlogFields {
                  readTime
                  keywords
                }
              }
            }
          }
        }
      `;
      
      const response = await fetch(wpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
      }
      
      if (!result.data?.posts?.edges) {
        throw new Error('No posts found');
      }
      
      // Transform the posts
      const transformedPosts = result.data.posts.edges.map(edge => {
        const post = edge.node;
        
        // Clean content
        const cleanExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';
        const cleanContent = post.content?.replace(/<[^>]*>/g, '') || cleanExcerpt;
        
        // Generate keywords from ACF field or extract from content
        let keywords = [];
        if (post.acfBlogFields?.keywords) {
          keywords = post.acfBlogFields.keywords
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0);
        } else {
          // Extract keywords from categories and title
          const categoryKeywords = post.categories.edges.map(edge => edge.node.name.toLowerCase());
          const titleWords = post.title.toLowerCase()
            .split(' ')
            .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'your', 'this', 'that'].includes(word));
          
          keywords = [...new Set([...categoryKeywords, ...titleWords])];
        }
        
        return {
          id: parseInt(post.id.replace('post:', '')) || Math.random(),
          title: post.title,
          slug: post.slug,
          excerpt: cleanExcerpt,
          content: cleanContent,
          categories: post.categories.edges.map(edge => edge.node.name),
          publishedDate: new Date(post.date).toLocaleDateString(),
          readTime: post.acfBlogFields?.readTime || '5 min read',
          keywords: keywords
        };
      });
      
      setPosts(transformedPosts);
      console.log(`✅ Loaded ${transformedPosts.length} posts successfully`);
      
    } catch (error) {
      console.error('❌ WordPress connection failed:', error);
      
      // Use fallback data for development
      const fallbackPosts = [
        {
          id: 1,
          title: "The Science Behind Habit Formation",
          slug: "science-behind-habit-formation",
          excerpt: "Discover the neurological processes that drive habit formation.",
          content: "Habit formation is fascinating from a neuroscience perspective. The basal ganglia plays a crucial role in automatic behaviors. When we repeat actions, our brain creates neural pathways that make these behaviors easier over time.",
          categories: ["Habit Formation", "Psychology"],
          publishedDate: "Dec 15, 2024",
          readTime: "5 min read",
          keywords: ["habit formation", "neuroscience", "psychology", "basal ganglia"]
        },
        {
          id: 2,
          title: "Breaking Bad Habits: A Scientific Approach",
          slug: "breaking-bad-habits-scientific-approach",
          excerpt: "Learn evidence-based strategies to eliminate unwanted behaviors.",
          content: "Breaking bad habits requires understanding the psychology behind automatic behaviors. The key is not just stopping the bad habit, but replacing it with something beneficial.",
          categories: ["Breaking Bad Habits", "Psychology"],
          publishedDate: "Dec 12, 2024",
          readTime: "6 min read",
          keywords: ["breaking habits", "behavior change", "psychology"]
        },
        {
          id: 3,
          title: "Digital Wellness: Reclaiming Your Attention",
          slug: "digital-wellness-smartphone-attention",
          excerpt: "Strategies to reduce screen time and manage digital addiction.",
          content: "Digital wellness has become essential in our hyper-connected world. Screen time addiction follows the same psychological patterns as other habits.",
          categories: ["Digital Wellness", "Productivity"],
          publishedDate: "Dec 10, 2024",
          readTime: "7 min read",
          keywords: ["digital wellness", "screen time", "productivity", "attention"]
        }
      ];
      
      setPosts(fallbackPosts);
    } finally {
      setPostsLoading(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // AI Analysis Function
  const generateAIInsights = useCallback(async (post, suggestions) => {
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post,
          suggestions,
          type: 'insights'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fallback) {
          setAiInsights(data.fallback);
          setAiError(`AI temporarily unavailable: ${data.error}`);
        } else {
          throw new Error(data.error || 'AI service error');
        }
      } else {
        setAiInsights(data);
        setAiError(null);
      }
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiError(`AI Analysis failed: ${error.message}`);
      
      // Provide fallback insights
      setAiInsights({
        strategicInsights: [
          "Consider this post's role in your overall content strategy and hub page structure.",
          "Evaluate linking opportunities based on topic relevance and user journey.",
          "Focus on creating content clusters around your main topic themes."
        ],
        contentGaps: [
          "Review competitor content for missing topics in your niche.",
          "Consider user questions that haven't been addressed yet.",
          "Identify opportunities for more detailed follow-up content."
        ],
        seoOpportunities: [
          "Focus on natural internal linking within your content flow.",
          "Optimize meta descriptions with target keywords from linked posts.",
          "Create topic clusters to improve topical authority."
        ],
        readabilityScore: 85,
        linkingPotential: "High",
        recommendedActions: [
          "Add 2-3 contextual internal links to this post",
          "Update meta description to include primary keywords",
          "Create a related reading section at the end of the post",
          "Monitor click-through rates and engagement after implementing links"
        ]
      });
    } finally {
      setAiLoading(false);
    }
  }, []);

  // AI Chat Function
  const sendChatMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const context = selectedPost ? 
        `Current post: "${selectedPost.title}" - Categories: ${selectedPost.categories.join(', ')} - Keywords: ${selectedPost.keywords.join(', ')}` 
        : null;

      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chat',
          message,
          context,
          chatHistory: chatMessages.slice(-6) // Keep last 3 exchanges for context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat service error');
      }

      const aiMessage = { role: 'assistant', content: data.content };
      setChatMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: `Sorry, I'm having trouble connecting right now. Error: ${error.message}` 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  // Find interlinking opportunities
  const findInterlinkingSuggestions = useCallback((currentPost) => {
    if (!currentPost) return [];

    const suggestionsResults = [];
    const currentContent = currentPost.content.toLowerCase();

    posts.forEach(post => {
      if (post.id === currentPost.id) return;

      let relevanceScore = 0;
      const matchedKeywords = [];

      // Check for keyword matches in content
      post.keywords.forEach(keyword => {
        if (currentContent.includes(keyword.toLowerCase())) {
          relevanceScore += 10;
          matchedKeywords.push(keyword);
        }
      });

      // Check for category overlap
      const categoryOverlap = post.categories.filter(cat => 
        currentPost.categories.includes(cat)
      );
      relevanceScore += categoryOverlap.length * 5;

      // Boost score for title word matches
      const titleWords = post.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.length > 4 && currentContent.includes(word)) {
          relevanceScore += 3;
        }
      });

      if (relevanceScore > 5) {
        suggestionsResults.push({
          post,
          relevanceScore,
          matchedKeywords,
          categoryOverlap,
          recommendedAnchorText: post.title,
          linkingOpportunities: matchedKeywords.length
        });
      }
    });

    return suggestionsResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [posts]);

  const handlePostSelect = useCallback((post) => {
    setSelectedPost(post);
    setLoading(true);
    setAiInsights(null);
    setAiError(null);
    
    setTimeout(() => {
      const interlinkingSuggestions = findInterlinkingSuggestions(post);
      setSuggestions(interlinkingSuggestions);
      setLoading(false);
      
      // Generate AI insights automatically
      generateAIInsights(post, interlinkingSuggestions);
    }, 1000);
  }, [findInterlinkingSuggestions, generateAIInsights]);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLinks(prev => new Set([...prev, id]));
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [posts, searchTerm]);

  const getRelevanceColor = (score) => {
    if (score >= 20) return 'text-green-600 bg-green-50';
    if (score >= 15) return 'text-blue-600 bg-blue-50';
    if (score >= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getRelevanceLabel = (score) => {
    if (score >= 20) return 'High Priority';
    if (score >= 15) return 'Good Match';
    if (score >= 10) return 'Moderate';
    return 'Low Priority';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-anton uppercase">
              HabitNova SEO Interlinking Tool
            </h1>
            <p className="text-gray-600 font-roboto">
              Discover internal linking opportunities with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAiPanel 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bot className="h-5 w-5" />
              AI Assistant
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Post Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-anton uppercase">
                Select a Blog Post
              </h2>
              <button
                onClick={loadPosts}
                disabled={postsLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh posts from WordPress"
              >
                <RefreshCw className={`h-4 w-4 ${postsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm font-roboto">Loading posts from WordPress...</p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts by title, category, or keyword..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-roboto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Posts Count */}
                <div className="mb-4 text-sm text-gray-600 font-roboto">
                  {filteredPosts.length} posts available for analysis
                </div>

                {/* Posts List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => handlePostSelect(post)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPost?.id === post.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 font-roboto">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 font-roboto">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {post.readTime}
                          </span>
                          <span>•</span>
                          <span>{post.categories.join(', ')}</span>
                        </div>
                        <span>{post.publishedDate}</span>
                      </div>
                      
                      {/* Keywords Preview */}
                      {post.keywords.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.keywords.slice(0, 3).map(keyword => (
                            <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                          {post.keywords.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{post.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredPosts.length === 0 && !postsLoading && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-4 text-gray-300" />
                      <p className="font-roboto">No posts found matching your search</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle Panel - Interlinking Suggestions */}
        <div className={showAiPanel ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-anton uppercase">
            Interlinking Suggestions
          </h2>

          {!selectedPost ? (
            <div className="text-center py-12 text-gray-500">
              <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-roboto">Select a blog post to see interlinking suggestions</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-roboto">Analyzing content for linking opportunities...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Post Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 font-roboto">
                  Currently Analyzing: {selectedPost.title}
                </h3>
                <p className="text-sm text-blue-700 font-roboto">
                  Found {suggestions.length} potential linking opportunities
                </p>
              </div>

              {/* Suggestions */}
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-4 text-gray-300" />
                  <p className="font-roboto">No strong interlinking opportunities found for this post.</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div key={suggestion.post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 font-roboto">
                          {suggestion.post.title}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(suggestion.relevanceScore)}`}>
                            {getRelevanceLabel(suggestion.relevanceScore)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Score: {suggestion.relevanceScore}
                          </span>
                        </div>
                        {suggestion.matchedKeywords.length > 0 && (
                          <div className="text-xs text-gray-600 mb-2">
                            Matched keywords: {suggestion.matchedKeywords.join(', ')}
                          </div>
                        )}
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                    </div>

                    {/* Suggested Link */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-700 block mb-1">Suggested Link:</span>
                          <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border font-roboto break-all">
                            &lt;a href=&quot;/blog/{suggestion.post.slug}&quot;&gt;{suggestion.recommendedAnchorText}&lt;/a&gt;
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`<a href="/blog/${suggestion.post.slug}">${suggestion.recommendedAnchorText}</a>`, suggestion.post.id)}
                          className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                          title="Copy HTML link"
                        >
                          {copiedLinks.has(suggestion.post.id) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* AI Panel */}
        {showAiPanel && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-anton uppercase">
                AI Assistant
              </h3>

              {/* AI Insights */}
              {selectedPost && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 font-roboto">Content Analysis</h4>
                  
                  {aiLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Analyzing content...</p>
                    </div>
                  ) : aiInsights ? (
                    <div className="space-y-4">
                      {aiError && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">{aiError}</span>
                          </div>
                        </div>
                      )}

                      {/* Strategic Insights */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <h5 className="font-semibold text-blue-900 text-sm">Strategic Insights</h5>
                        </div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {aiInsights.strategicInsights?.map((insight, i) => (
                            <li key={i}>• {insight}</li>
                          ))}
                        </ul>
                      </div>

                      {/* SEO Opportunities */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <h5 className="font-semibold text-green-900 text-sm">SEO Opportunities</h5>
                        </div>
                        <ul className="text-sm text-green-800 space-y-1">
                          {aiInsights.seoOpportunities?.map((opportunity, i) => (
                            <li key={i}>• {opportunity}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommended Actions */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <h5 className="font-semibold text-purple-900 text-sm">Next Actions</h5>
                        </div>
                        <ul className="text-sm text-purple-800 space-y-1">
                          {aiInsights.recommendedActions?.map((action, i) => (
                            <li key={i}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Chat Interface */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                    <span className="font-semibold text-gray-800 text-sm">SEO Chat</span>
                  </div>
                </div>

                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                      Ask me anything about SEO, internal linking, or content strategy!
                    </div>
                  ) : (
                    chatMessages.map((message, i) => (
                      <div key={i} className={`text-sm ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-200 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(chatInput)}
                      placeholder="Ask about SEO strategies..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => sendChatMessage(chatInput)}
                      disabled={!chatInput.trim()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-anton uppercase">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
              posts.length > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {posts.length > 0 ? '✓' : '✗'}
            </div>
            <div className="font-semibold text-gray-800 font-roboto">WordPress</div>
            <div className="text-sm text-gray-600">{posts.length} posts loaded</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
              suggestions.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {suggestions.length > 0 ? '✓' : '○'}
            </div>
            <div className="font-semibold text-gray-800 font-roboto">Analysis</div>
            <div className="text-sm text-gray-600">{suggestions.length} suggestions found</div>
          </div>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
              aiInsights ? 'bg-green-100 text-green-600' : aiError ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {aiInsights ? '✓' : aiError ? '!' : '○'}
            </div>
            <div className="font-semibold text-gray-800 font-roboto">AI Assistant</div>
            <div className="text-sm text-gray-600">
              {aiInsights ? 'Ready' : aiError ? 'Limited' : 'Standby'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoInterlinkingTool;