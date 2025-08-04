// src/app/admin/seo-tool/SeoInterlinkingTool.js - Fixed without useLoading
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
        // For demo purposes, use mock data
        const mockPosts = [
          {
            id: '1',
            title: 'How to Build Better Habits in 21 Days',
            slug: 'build-better-habits-21-days',
            content: 'This comprehensive guide explores the science behind habit formation and provides practical strategies for building lasting positive habits...',
            excerpt: 'Learn the proven methods for creating habits that stick.',
            categories: ['Habit Formation', 'Personal Development'],
            keywords: ['habits', 'behavior change', '21 days', 'psychology'],
            readTime: '8',
            date: '2024-01-15'
          },
          {
            id: '2',
            title: 'Breaking Bad Habits: A Scientific Approach',
            slug: 'breaking-bad-habits-scientific-approach',
            content: 'Understanding the neuroscience behind addiction and bad habits can help you develop effective strategies for breaking free...',
            excerpt: 'Use science-backed methods to eliminate negative behaviors.',
            categories: ['Habit Formation', 'Psychology'],
            keywords: ['bad habits', 'addiction', 'neuroscience', 'behavior change'],
            readTime: '12',
            date: '2024-01-20'
          },
          {
            id: '3',
            title: 'The Psychology of Motivation and Habit Stacking',
            slug: 'psychology-motivation-habit-stacking',
            content: 'Habit stacking is a powerful technique that leverages existing habits to build new ones. This post explores the psychology behind it...',
            excerpt: 'Learn how to stack habits for maximum effectiveness.',
            categories: ['Psychology', 'Productivity'],
            keywords: ['motivation', 'habit stacking', 'productivity', 'psychology'],
            readTime: '10',
            date: '2024-01-25'
          }
        ];
        
        setPosts(mockPosts);
        console.log('Using mock data for demo');
        setPostsLoading(false);
        return;
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
        throw new Error(result.errors[0].message);
      }
      
      const formattedPosts = result.data.posts.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        slug: edge.node.slug,
        content: edge.node.content,
        excerpt: edge.node.excerpt,
        date: edge.node.date,
        categories: edge.node.categories.edges.map(cat => cat.node.name),
        keywords: edge.node.acfBlogFields?.keywords || [],
        readTime: edge.node.acfBlogFields?.readTime || '5'
      }));
      
      setPosts(formattedPosts);
      console.log(`✅ Loaded ${formattedPosts.length} posts from WordPress`);
      
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Use demo data as fallback
      const mockPosts = [
        {
          id: '1',
          title: 'How to Build Better Habits in 21 Days',
          slug: 'build-better-habits-21-days',
          content: 'This comprehensive guide explores the science behind habit formation...',
          excerpt: 'Learn the proven methods for creating habits that stick.',
          categories: ['Habit Formation', 'Personal Development'],
          keywords: ['habits', 'behavior change', '21 days', 'psychology'],
          readTime: '8',
          date: '2024-01-15'
        }
      ];
      setPosts(mockPosts);
    } finally {
      setPostsLoading(false);
    }
  };

  // Initialize posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Handle post selection and analyze for linking opportunities
  const handlePostSelect = async (post) => {
    setSelectedPost(post);
    setLoading(true);
    setSuggestions([]);
    setAiInsights(null);

    try {
      // Analyze the selected post content for internal linking opportunities
      const linkingSuggestions = await analyzePostForLinking(post, posts);
      setSuggestions(linkingSuggestions);
      
      // Get AI insights for the post
      await getAiInsights(post, linkingSuggestions);
      
    } catch (error) {
      console.error('Error analyzing post:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analyze post content for internal linking opportunities
  const analyzePostForLinking = async (targetPost, allPosts) => {
    const suggestions = [];
    
    // Filter out the target post itself
    const availablePosts = allPosts.filter(p => p.id !== targetPost.id);
    
    availablePosts.forEach(post => {
      let relevanceScore = 0;
      const reasons = [];
      
      // Check category overlap
      const categoryOverlap = post.categories.filter(cat => 
        targetPost.categories.includes(cat)
      );
      if (categoryOverlap.length > 0) {
        relevanceScore += categoryOverlap.length * 10;
        reasons.push(`Shares categories: ${categoryOverlap.join(', ')}`);
      }
      
      // Check keyword overlap
      const keywordOverlap = post.keywords.filter(keyword =>
        targetPost.keywords.some(targetKeyword => 
          keyword.toLowerCase().includes(targetKeyword.toLowerCase()) ||
          targetKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      if (keywordOverlap.length > 0) {
        relevanceScore += keywordOverlap.length * 5;
        reasons.push(`Related keywords: ${keywordOverlap.join(', ')}`);
      }
      
      // Check content similarity (basic keyword matching)
      const targetWords = targetPost.content.toLowerCase().split(/\s+/);
      const postWords = post.content.toLowerCase().split(/\s+/);
      const commonWords = targetWords.filter(word => 
        word.length > 4 && postWords.includes(word)
      );
      if (commonWords.length > 10) {
        relevanceScore += Math.min(commonWords.length, 20);
        reasons.push(`Content similarity (${commonWords.length} common terms)`);
      }
      
      // Check title similarity
      const targetTitleWords = targetPost.title.toLowerCase().split(/\s+/);
      const postTitleWords = post.title.toLowerCase().split(/\s+/);
      const titleOverlap = targetTitleWords.filter(word => 
        word.length > 3 && postTitleWords.includes(word)
      );
      if (titleOverlap.length > 0) {
        relevanceScore += titleOverlap.length * 8;
        reasons.push(`Title similarity: ${titleOverlap.join(', ')}`);
      }
      
      // Only include suggestions with meaningful relevance
      if (relevanceScore >= 8) {
        suggestions.push({
          post,
          relevanceScore,
          reasons,
          suggestedAnchorText: generateAnchorText(post, targetPost),
          linkUrl: `/blog/${post.slug}`
        });
      }
    });
    
    // Sort by relevance score (highest first)
    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Generate suggested anchor text for linking
  const generateAnchorText = (linkPost, targetPost) => {
    const suggestions = [
      linkPost.title,
      `"${linkPost.title}"`,
      ...linkPost.keywords.slice(0, 2),
      linkPost.categories[0]
    ].filter(Boolean);
    
    return suggestions[0] || linkPost.title;
  };

  // Get AI insights for the selected post
  const getAiInsights = async (post, suggestions) => {
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'insights',
          post,
          suggestions
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const insights = await response.json();
      setAiInsights(insights);
      
    } catch (error) {
      console.error('Failed to get AI insights:', error);
      setAiError('AI insights temporarily unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  // Handle copying link to clipboard
  const handleCopyLink = async (suggestion) => {
    try {
      const linkHtml = `<a href="${suggestion.linkUrl}">${suggestion.suggestedAnchorText}</a>`;
      await navigator.clipboard.writeText(linkHtml);
      
      setCopiedLinks(prev => new Set(prev).add(suggestion.post.id));
      
      // Remove the copied indicator after 3 seconds
      setTimeout(() => {
        setCopiedLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(suggestion.post.id);
          return newSet;
        });
      }, 3000);
      
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    
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
    <div className="max-w-7xl mx-auto pt-8 p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-anton uppercase">
              Habit Nova SEO Interlinking Tool
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
                <p className="text-gray-600 text-sm font-roboto">Loading posts...</p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-roboto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Posts List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => handlePostSelect(post)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPost?.id === post.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 font-roboto leading-tight">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.categories.slice(0, 2).map(category => (
                          <span
                            key={category}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-roboto"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 font-roboto">
                        {post.readTime} min read
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Panel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-anton uppercase">
              Analysis Status
            </h3>
            <div className="grid grid-cols-1 gap-3">
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

        {/* Middle Panel - Suggestions */}
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
                  <Target className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                  <p className="font-roboto">No strong linking opportunities found for this post.</p>
                  <p className="text-sm text-gray-400 mt-2">Try selecting a different post or check content overlap.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.post.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 font-roboto leading-tight">
                              {suggestion.post.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded font-roboto ${getRelevanceColor(suggestion.relevanceScore)}`}>
                              {getRelevanceLabel(suggestion.relevanceScore)} ({suggestion.relevanceScore})
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {suggestion.post.categories.map(category => (
                              <span
                                key={category}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-roboto"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 font-roboto mb-2">
                              <strong>Suggested anchor text:</strong> "{suggestion.suggestedAnchorText}"
                            </p>
                            <p className="text-sm text-gray-600 font-roboto">
                              <strong>Link URL:</strong> {suggestion.linkUrl}
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 font-roboto font-medium mb-1">Why this works:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {suggestion.reasons.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 font-roboto">
                                  <span className="text-blue-500 text-xs mt-1">•</span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleCopyLink(suggestion)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
                          title="Copy HTML link to clipboard"
                        >
                          {copiedLinks.has(suggestion.post.id) ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - AI Insights */}
        {showAiPanel && (
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 font-anton uppercase">
                AI Insights
              </h2>
              <button
                onClick={() => setShowAiPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {!selectedPost ? (
              <div className="text-center py-8 text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-roboto">Select a post to get AI-powered insights</p>
              </div>
            ) : aiLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm font-roboto">AI is analyzing your content...</p>
              </div>
            ) : aiError ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold font-roboto">AI Assistant Unavailable</span>
                </div>
                <p className="text-sm text-yellow-700 font-roboto">{aiError}</p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-6">
                {/* Strategic Insights */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-3">
                    <Lightbulb className="h-5 w-5" />
                    <span className="font-semibold font-roboto">Strategic Insights</span>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-700">
                    {aiInsights.strategicInsights?.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-roboto">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO Opportunities */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 mb-3">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold font-roboto">SEO Opportunities</span>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    {aiInsights.seoOpportunities?.map((opportunity, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-roboto">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Gaps */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-800 mb-3">
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold font-roboto">Content Gaps</span>
                  </div>
                  <ul className="space-y-2 text-sm text-orange-700">
                    {aiInsights.contentGaps?.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-roboto">
                        <span className="text-orange-500 text-xs mt-1">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-800 mb-3">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold font-roboto">Recommended Actions</span>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-700">
                    {aiInsights.recommendedActions?.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-roboto">
                        <span className="text-purple-500 text-xs mt-1">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                {(aiInsights.readabilityScore || aiInsights.linkingPotential) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 font-roboto">Quick Metrics</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {aiInsights.readabilityScore && (
                        <div>
                          <span className="text-gray-600 font-roboto">Readability:</span>
                          <span className="ml-2 font-semibold text-gray-800">{aiInsights.readabilityScore}/100</span>
                        </div>
                      )}
                      {aiInsights.linkingPotential && (
                        <div>
                          <span className="text-gray-600 font-roboto">Link Potential:</span>
                          <span className="ml-2 font-semibold text-gray-800">{aiInsights.linkingPotential}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoInterlinkingTool;