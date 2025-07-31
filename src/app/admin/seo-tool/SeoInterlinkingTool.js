'use client';

// src/app/admin/seo-tool/SEOInterlinkingTool.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Link, Target, TrendingUp, FileText, ArrowRight, Copy, CheckCircle, Bot, Lightbulb, Zap, MessageSquare, AlertCircle, RefreshCw, Bug } from 'lucide-react';

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
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // Direct WordPress fetch for debugging
  const debugWordPressConnection = async () => {
    setPostsLoading(true);
    setDebugInfo(null);
    
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
      console.log('🔍 WordPress URL:', wpUrl);
      
      if (!wpUrl || wpUrl === 'https://your-wordpress-site.com/graphql') {
        throw new Error('WordPress URL not configured');
      }
      
      // Test basic connection first
      const testQuery = `
        query TestConnection {
          posts(first: 5, where: { status: PUBLISH }) {
            edges {
              node {
                id
                title
                slug
                excerpt
                date
                categories {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;
      
      console.log('🚀 Sending test query...');
      
      const response = await fetch(wpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: testQuery })
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📦 Full response:', result);
      
      if (result.errors) {
        setDebugInfo({
          status: 'error',
          message: 'GraphQL Errors',
          details: result.errors,
          url: wpUrl
        });
        throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
      }
      
      if (!result.data?.posts?.edges) {
        setDebugInfo({
          status: 'error',
          message: 'No posts found in response',
          details: result.data,
          url: wpUrl
        });
        throw new Error('No posts found');
      }
      
      // Transform the posts
      const transformedPosts = result.data.posts.edges.map(edge => {
        const post = edge.node;
        
        // Clean content
        const cleanExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';
        
        // Generate keywords from title and categories
        const categoryKeywords = post.categories.edges.map(edge => edge.node.name.toLowerCase());
        const titleWords = post.title.toLowerCase()
          .split(' ')
          .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'your', 'this', 'that'].includes(word));
        
        const keywords = [...new Set([...categoryKeywords, ...titleWords])];
        
        return {
          id: parseInt(post.id.replace('post:', '')) || Math.random(),
          title: post.title,
          slug: post.slug,
          excerpt: cleanExcerpt,
          content: cleanExcerpt, // Using excerpt as content for now
          categories: post.categories.edges.map(edge => edge.node.name),
          publishedDate: new Date(post.date).toLocaleDateString(),
          readTime: '5 min read', // Default for now
          keywords: keywords
        };
      });
      
      setDebugInfo({
        status: 'success',
        message: `Successfully loaded ${transformedPosts.length} posts`,
        details: {
          postsCount: transformedPosts.length,
          firstPost: transformedPosts[0],
          url: wpUrl
        }
      });
      
      setPosts(transformedPosts);
      console.log('✅ Posts loaded successfully:', transformedPosts);
      
    } catch (error) {
      console.error('❌ WordPress connection failed:', error);
      
      setDebugInfo({
        status: 'error',
        message: error.message,
        details: {
          url: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
          error: error.message
        }
      });
      
      // Use fallback data
      const fallbackPosts = [
        {
          id: 1,
          title: "Fallback: The Science Behind Habit Formation",
          slug: "fallback-habit-formation",
          excerpt: "This is fallback data because WordPress connection failed.",
          content: "Fallback content for testing the SEO tool when WordPress is not available.",
          categories: ["Habit Formation", "Psychology"],
          publishedDate: "Dec 15, 2024",
          readTime: "5 min read",
          keywords: ["habit formation", "psychology", "fallback"]
        },
        {
          id: 2,
          title: "Fallback: Breaking Bad Habits",
          slug: "fallback-breaking-habits",
          excerpt: "This is fallback data for testing purposes.",
          content: "Fallback content about breaking bad habits and behavior change.",
          categories: ["Breaking Bad Habits"],
          publishedDate: "Dec 12, 2024",
          readTime: "6 min read",
          keywords: ["breaking habits", "behavior change", "fallback"]
        }
      ];
      
      setPosts(fallbackPosts);
    } finally {
      setPostsLoading(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    debugWordPressConnection();
  }, []);

  // Server-side AI Analysis Function
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
      }
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiError(`AI Analysis failed: ${error.message}`);
      
      // Provide fallback insights
      setAiInsights({
        strategicInsights: [
          "AI analysis temporarily unavailable. Manual review recommended.",
          "Consider this post role in your overall content strategy.",
          "Evaluate linking opportunities based on topic relevance."
        ],
        contentGaps: [
          "Manual content gap analysis needed.",
          "Review competitor content for missing topics.",
          "Consider user questions not yet addressed."
        ],
        seoOpportunities: [
          "Focus on natural internal linking within content.",
          "Optimize meta descriptions and titles.",
          "Review keyword density and semantic keywords."
        ],
        readabilityScore: 75,
        linkingPotential: "Medium",
        recommendedActions: [
          "Manually review content for linking opportunities",
          "Update meta descriptions with target keywords",
          "Add related reading section at post end",
          "Monitor performance after implementing changes"
        ]
      });
    } finally {
      setAiLoading(false);
    }
  }, []);

  // Find interlinking opportunities
  const findInterlinkingSuggestions = useCallback((currentPost) => {
    if (!currentPost) return [];

    const suggestionsResults = [];
    const currentContent = currentPost.content.toLowerCase();

    posts.forEach(post => {
      if (post.id === currentPost.id) return;

      let relevanceScore = 0;
      const matchedKeywords = [];
      const contextualMatches = [];

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

      if (relevanceScore > 5) {
        suggestionsResults.push({
          post,
          relevanceScore,
          matchedKeywords,
          contextualMatches,
          linkablePhrasesInContent: [],
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-[Anton] uppercase">
              HabitNova SEO Interlinking Tool
            </h1>
            <p className="text-gray-600 font-[Roboto]">
              Discover internal linking opportunities with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <Bug className="h-4 w-4" />
              Debug
            </button>
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

      {/* Debug Panel */}
      {showDebug && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bug className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-900 font-[Anton] uppercase">
              Debug Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2 font-[Roboto]">Environment Check:</h4>
              <div className="bg-yellow-100 p-3 rounded text-sm font-mono">
                <div>WordPress URL: {process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'NOT SET'}</div>
                <div>Posts loaded: {posts.length}</div>
                <div>Loading state: {postsLoading ? 'Loading...' : 'Complete'}</div>
              </div>
            </div>
            
            {debugInfo && (
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2 font-[Roboto]">Connection Status:</h4>
                <div className={`p-3 rounded text-sm ${
                  debugInfo.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="font-semibold">{debugInfo.message}</div>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(debugInfo.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            <button
              onClick={debugWordPressConnection}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Test WordPress Connection
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Post Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-[Anton] uppercase">
                Select a Blog Post
              </h2>
              <button
                onClick={debugWordPressConnection}
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
                <p className="text-gray-600 text-sm font-[Roboto]">Loading posts from WordPress...</p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts by title, category, or keyword..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Posts Count */}
                <div className="mb-4 text-sm text-gray-600 font-[Roboto]">
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
                      <h3 className="font-semibold text-gray-900 mb-2 font-[Roboto]">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 font-[Roboto]">
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
                      <p className="font-[Roboto]">No posts found matching your search</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle Panel - Interlinking Suggestions */}
        <div className={showAiPanel ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-[Anton] uppercase">
            Interlinking Suggestions
          </h2>

          {!selectedPost ? (
            <div className="text-center py-12 text-gray-500">
              <Link className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="font-[Roboto]">Select a blog post to see interlinking suggestions</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-[Roboto]">Analyzing content for linking opportunities...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Post Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 font-[Roboto]">
                  Currently Analyzing: {selectedPost.title}
                </h3>
                <p className="text-sm text-blue-700 font-[Roboto]">
                  Found {suggestions.length} potential linking opportunities
                </p>
              </div>

              {/* Suggestions */}
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-4 text-gray-300" />
                  <p className="font-[Roboto]">No strong interlinking opportunities found for this post.</p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div key={suggestion.post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 font-[Roboto]">
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
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                    </div>

                    {/* Suggested Link */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-700 block mb-1">Suggested Link:</span>
                          <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border font-[Roboto] break-all">
                            &lt;a href=&quot;/{suggestion.post.slug}&quot;&gt;{suggestion.recommendedAnchorText}&lt;/a&gt;
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(`<a href="/${suggestion.post.slug}">${suggestion.recommendedAnchorText}</a>`, suggestion.post.id)}
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

        {/* AI Panel - Simplified for debugging */}
        {showAiPanel && (
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-[Anton] uppercase">AI Assistant</h3>
            <p className="text-gray-600 font-[Roboto]">AI features available once WordPress connection is working properly.</p>
          </div>
        )}
      </div>

      {/* WordPress Connection Status */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4 font-[Anton] uppercase">
          WordPress Connection Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 font-[Roboto]">Current Settings</h4>
            <div className="text-sm text-gray-600 space-y-1 font-[Roboto]">
              <div>URL: {process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'Not configured'}</div>
              <div>Posts loaded: {posts.length}</div>
              <div>Status: {postsLoading ? 'Loading...' : posts.length > 0 ? 'Connected' : 'Failed'}</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 font-[Roboto]">Troubleshooting</h4>
            <div className="text-sm text-gray-600 space-y-1 font-[Roboto]">
              <div>1. Check your .env.local file</div>
              <div>2. Verify WordPress is accessible</div>
              <div>3. Check browser console for errors</div>
              <div>4. Click the Debug button above</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoInterlinkingTool;