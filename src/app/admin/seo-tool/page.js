import React, { useState, useEffect, useMemo } from 'react';
import { Search, Link, Target, TrendingUp, FileText, ArrowRight, Copy, CheckCircle, Bot, Lightbulb, Zap, MessageSquare, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';

const SEOInterlinkingTool = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedLinks, setCopiedLinks] = useState(new Set());
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);

  // Initialize OpenAI client
  const [openai, setOpenai] = useState(null);

  useEffect(() => {
    // Check if OpenAI API key is configured
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your-openai-api-key-here') {
      const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Only for client-side usage
      });
      setOpenai(client);
      setApiKeyConfigured(true);
    }
  }, []);

  // Mock data - replace with actual GraphQL query to your WordPress backend
  const mockPosts = [
    {
      id: 1,
      title: "The Science Behind Habit Formation: What Your Brain Really Does",
      slug: "science-behind-habit-formation",
      excerpt: "Discover the neurological processes that drive habit formation and how understanding your brain can help you build lasting changes.",
      content: "Habit formation is fascinating from a neuroscience perspective. The basal ganglia plays a crucial role in automatic behaviors. When we repeat actions, our brain creates neural pathways that make these behaviors easier over time. Research shows that it takes an average of 66 days to form a new habit, though this varies significantly based on complexity. The habit loop consists of three parts: cue, routine, and reward. Understanding this cycle is essential for both building good habits and breaking bad ones. Digital wellness and screen time management follow the same principles. Productivity habits often start with small changes that compound over time.",
      categories: ["Habit Formation", "Psychology"],
      publishedDate: "2024-01-15",
      readTime: 8,
      keywords: ["habit formation", "neuroscience", "basal ganglia", "habit loop", "neural pathways", "behavior change"]
    },
    {
      id: 2,
      title: "Breaking Bad Habits: A Step-by-Step Scientific Approach",
      slug: "breaking-bad-habits-scientific-approach",
      excerpt: "Learn evidence-based strategies to eliminate unwanted behaviors and replace them with positive alternatives.",
      content: "Breaking bad habits requires understanding the psychology behind automatic behaviors. The key is not just stopping the bad habit, but replacing it with something beneficial. Habit stacking is a powerful technique where you attach new behaviors to existing routines. Environmental design plays a crucial role - changing your surroundings can disrupt negative patterns. Mindfulness and awareness are the first steps to recognizing trigger situations. Research from Stanford University shows that implementation intentions significantly improve success rates. The habit formation process works in reverse when breaking habits - we need to disrupt the cue-routine-reward cycle.",
      categories: ["Breaking Bad Habits", "Psychology"],
      publishedDate: "2024-01-20", 
      readTime: 6,
      keywords: ["breaking habits", "habit stacking", "environmental design", "mindfulness", "implementation intentions", "behavior change"]
    },
    {
      id: 3,
      title: "Digital Wellness: Reclaiming Your Attention in the Smartphone Age",
      slug: "digital-wellness-smartphone-attention",
      excerpt: "Practical strategies to reduce screen time, manage social media addiction, and create healthier relationships with technology.",
      content: "Digital wellness has become essential in our hyper-connected world. Screen time addiction follows the same psychological patterns as other habits - cue, routine, reward. Social media platforms are designed to trigger dopamine responses, making them inherently addictive. To improve digital wellness, start by auditing your current usage patterns. Set specific times for checking emails and social media. Create phone-free zones in your home, especially the bedroom. The concept of 'attention residue' shows how constant digital switching reduces our ability to focus deeply. Productivity often improves dramatically when we establish better digital boundaries.",
      categories: ["Digital Wellness", "Productivity"],
      publishedDate: "2024-01-25",
      readTime: 7,
      keywords: ["digital wellness", "screen time", "social media addiction", "dopamine", "attention residue", "productivity"]
    },
    {
      id: 4,
      title: "The Psychology of Habit Stacking: Compound Your Success",
      slug: "psychology-habit-stacking-compound-success",
      excerpt: "Master the art of linking new habits to existing routines for exponential behavior change results.",
      content: "Habit stacking leverages existing neural pathways to build new behaviors more effectively. This technique, popularized by behavior change research, works by anchoring new habits to established routines. The key is choosing the right existing habit as your anchor - it should be specific, automatic, and occur at the right time. Environmental design supports habit stacking by providing consistent cues. Small wins compound over time, creating momentum for larger changes. This approach is particularly effective for morning routines and productivity systems. The psychology behind habit stacking relates to implementation intentions and contextual cues that trigger desired behaviors.",
      categories: ["Habit Formation", "Productivity"],
      publishedDate: "2024-02-01",
      readTime: 5,
      keywords: ["habit stacking", "neural pathways", "implementation intentions", "morning routines", "environmental design", "compound habits"]
    },
    {
      id: 5,
      title: "Mindfulness and Habit Change: The Power of Present-Moment Awareness",
      slug: "mindfulness-habit-change-present-moment-awareness",
      excerpt: "How mindfulness practices can accelerate habit formation and help you become more intentional with your daily behaviors.",
      content: "Mindfulness serves as a powerful catalyst for habit change by increasing self-awareness and breaking automatic response patterns. When we practice present-moment awareness, we can catch ourselves in the middle of unwanted behaviors and make conscious choices instead. Research shows that mindfulness meditation actually changes brain structure, strengthening areas associated with attention and emotional regulation. This neuroplasticity supports both breaking bad habits and forming new ones. Mindful eating, for example, helps people develop healthier relationships with food by increasing awareness of hunger cues and emotional triggers. The intersection of mindfulness and habit formation creates space for intentional behavior change rather than reactive patterns.",
      categories: ["Mindfulness", "Psychology"],
      publishedDate: "2024-02-05",
      readTime: 6,
      keywords: ["mindfulness", "present-moment awareness", "neuroplasticity", "emotional regulation", "mindful eating", "intentional behavior"]
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  // Real AI Analysis Function
  const generateAIInsights = async (post, suggestions) => {
    if (!openai || !apiKeyConfigured) {
      setAiError("OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    
    try {
      const suggestionsText = suggestions.length > 0 
        ? suggestions.map(s => `- ${s.post.title} (Categories: ${s.post.categories.join(', ')}, Relevance Score: ${s.relevanceScore})`).join('\n')
        : "No linking suggestions found.";

      const prompt = `
      Analyze this blog post for SEO interlinking opportunities and provide strategic insights:
      
      BLOG POST DETAILS:
      Title: ${post.title}
      Content Preview: ${post.content.substring(0, 1500)}...
      Categories: ${post.categories.join(', ')}
      Keywords: ${post.keywords.join(', ')}
      Read Time: ${post.readTime} minutes
      
      AVAILABLE POSTS TO LINK TO:
      ${suggestionsText}
      
      Please provide a comprehensive analysis in the following JSON format:
      {
        "strategicInsights": [
          "Strategic insight about hub pages, content clusters, or positioning",
          "Insight about content authority and topic expertise",
          "Insight about user journey and content flow"
        ],
        "contentGaps": [
          "Missing content or linking opportunities",
          "Topics that could strengthen this post",
          "Related content that should be created"
        ],
        "seoOpportunities": [
          "Specific SEO improvements for rankings",
          "Internal linking strategies for this post",
          "Optimization tactics for better search visibility"
        ],
        "readabilityScore": 85,
        "linkingPotential": "High",
        "recommendedActions": [
          "Specific action with clear implementation steps",
          "Another actionable recommendation",
          "Third specific action to take",
          "Fourth optimization step"
        ]
      }
      
      Focus on actionable, specific advice for a habit formation blog. Consider user intent, search behavior, and content marketing best practices.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO strategist and content marketing specialist with deep knowledge of habit formation, psychology, and behavior change content. Provide actionable, specific insights that will improve search rankings and user engagement. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      setAiInsights(aiResponse);
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiError(`AI Analysis failed: ${error.message}`);
      
      // Provide fallback insights
      setAiInsights({
        strategicInsights: [
          "AI analysis temporarily unavailable. Manual review recommended.",
          "Consider this post's role in your overall content strategy.",
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
  };

  // Real Chat functionality
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    if (!openai || !apiKeyConfigured) {
      setAiError("OpenAI API key not configured for chat functionality.");
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    try {
      const contextPrompt = selectedPost ? `
      CURRENT CONTEXT:
      - Selected Post: "${selectedPost.title}"
      - Post Categories: ${selectedPost.categories.join(', ')}
      - Available Link Suggestions: ${suggestions.length} opportunities
      - Blog Focus: Habit formation, behavior change, digital wellness, productivity, psychology
      ` : "No post currently selected.";

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert SEO and content marketing consultant specializing in habit formation and behavior change blogs. You help with:

            - Internal linking strategies and best practices
            - SEO optimization for habit/psychology content  
            - Content clustering and site architecture
            - User experience and content flow optimization
            - Anchor text optimization and natural link integration
            - Performance tracking and analytics insights

            Provide specific, actionable advice. Reference the current context when relevant. Keep responses concise but comprehensive.

            ${contextPrompt}`
          },
          ...chatMessages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          {
            role: 'user',
            content: currentInput
          }
        ],
        max_tokens: 600,
        temperature: 0.8
      });

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.choices[0].message.content,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('Chat Error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I'm sorry, I encountered an error: ${error.message}. Please try again or check your API configuration.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
    }
  };

  // Find interlinking opportunities
  const findInterlinkingSuggestions = (currentPost) => {
    if (!currentPost) return [];

    const suggestions = [];
    const currentContent = currentPost.content.toLowerCase();
    const currentKeywords = currentPost.keywords.map(k => k.toLowerCase());

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

      // Find specific phrases that could be linked
      const linkablePhrasesInContent = [];
      post.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
        const matches = currentContent.match(regex);
        if (matches) {
          linkablePhrasesInContent.push({
            phrase: keyword,
            occurrences: matches.length
          });
        }
      });

      // Check for title matches in content
      const titleWords = post.title.toLowerCase().split(' ').filter(word => 
        word.length > 3 && !['the', 'and', 'for', 'with', 'your'].includes(word)
      );
      
      titleWords.forEach(word => {
        if (currentContent.includes(word)) {
          relevanceScore += 3;
          contextualMatches.push(word);
        }
      });

      if (relevanceScore > 5) {
        suggestions.push({
          post,
          relevanceScore,
          matchedKeywords,
          contextualMatches,
          linkablePhrasesInContent,
          categoryOverlap,
          recommendedAnchorText: post.title,
          linkingOpportunities: linkablePhrasesInContent.length + contextualMatches.length
        });
      }
    });

    return suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setLoading(true);
    setAiInsights(null);
    setAiError(null);
    
    // Simulate processing time
    setTimeout(() => {
      const interlinkingSuggestions = findInterlinkingSuggestions(post);
      setSuggestions(interlinkingSuggestions);
      setLoading(false);
      
      // Generate AI insights automatically if API is configured
      if (apiKeyConfigured) {
        generateAIInsights(post, interlinkingSuggestions);
      }
    }, 1000);
  };

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
            {!apiKeyConfigured && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <span className="font-[Roboto]">AI Offline</span>
              </div>
            )}
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
        <div className={`space-y-6 ${showAiPanel ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-[Anton] uppercase">
              Select a Blog Post
            </h2>
            
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
                        {post.readTime} min read
                      </span>
                      <span>•</span>
                      <span>{post.categories.join(', ')}</span>
                    </div>
                    <span>{post.publishedDate}</span>
                  </div>
                </div>
              ))}
            </div>
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
                suggestions.map((suggestion, index) => (
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

                    {/* Matching Details */}
                    <div className="space-y-2 mb-4">
                      {suggestion.matchedKeywords.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Keyword Matches:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {suggestion.matchedKeywords.map(keyword => (
                              <span key={keyword} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {suggestion.categoryOverlap.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Shared Categories:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {suggestion.categoryOverlap.map(category => (
                              <span key={category} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggested Link */}
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-700 block mb-1">Suggested Link:</span>
                          <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border font-[Roboto] break-all">
                            &lt;a href="/{suggestion.post.slug}"&gt;{suggestion.recommendedAnchorText}&lt;/a&gt;
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

                    {/* Link Preview */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        <span className="font-[Roboto]">
                          {suggestion.linkingOpportunities} potential linking opportunities in content
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Panel - AI Insights & Chat */}
        {showAiPanel && (
          <div className="lg:col-span-1 space-y-6">
            {/* AI Configuration Status */}
            {!apiKeyConfigured && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800 font-[Roboto]">AI Not Configured</h4>
                </div>
                <p className="text-sm text-yellow-700 font-[Roboto] mb-2">
                  Add your OpenAI API key to enable AI insights:
                </p>
                <code className="text-xs bg-yellow-100 p-2 rounded block font-[Roboto]">
                  NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
                </code>
              </div>
            )}

            {/* AI Error Display */}
            {aiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-800 font-[Roboto]">AI Error</h4>
                </div>
                <p className="text-sm text-red-700 font-[Roboto]">{aiError}</p>
              </div>
            )}

            {/* AI Insights */}
            {selectedPost && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-blue-900 font-[Anton] uppercase">
                    AI Insights
                  </h3>
                </div>

                {aiLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-blue-700 text-sm font-[Roboto]">Analyzing content with AI...</p>
                  </div>
                ) : aiInsights ? (
                  <div className="space-y-4">
                    {/* Strategic Insights */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <h4 className="font-semibold text-gray-800 font-[Roboto]">Strategic Insights</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {aiInsights.strategicInsights.map((insight, idx) => (
                          <li key={idx} className="font-[Roboto] text-xs leading-relaxed">• {insight}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Content Gaps */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <h4 className="font-semibold text-gray-800 font-[Roboto]">Content Gaps</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {aiInsights.contentGaps.map((gap, idx) => (
                          <li key={idx} className="font-[Roboto] text-xs leading-relaxed">• {gap}</li>
                        ))}
                      </ul>
                    </div>

                    {/* SEO Opportunities */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-gray-800 font-[Roboto]">SEO Opportunities</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {aiInsights.seoOpportunities.map((opportunity, idx) => (
                          <li key={idx} className="font-[Roboto] text-xs leading-relaxed">• {opportunity}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{aiInsights.readabilityScore}</div>
                        <div className="text-xs text-gray-600 font-[Roboto]">Readability</div>
                      </div>
                      <div className="bg-white rounded p-3 text-center">
                        <div className="text-lg font-bold text-green-600">{aiInsights.linkingPotential}</div>
                        <div className="text-xs text-gray-600 font-[Roboto]">Link Potential</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-blue-700 text-sm font-[Roboto]">
                    {apiKeyConfigured ? "Select a post to get AI-powered insights" : "Configure OpenAI API key to enable insights"}
                  </p>
                )}
              </div>
            )}

            {/* AI Chat Interface */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 p-4 border-b border-gray-200">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900 font-[Anton] uppercase">Ask AI Assistant</h3>
              </div>

              <div className="p-4">
                {/* Chat Messages */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Bot className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-[Roboto]">
                        {apiKeyConfigured 
                          ? "Ask me about SEO strategy, linking best practices, or content optimization!" 
                          : "Configure OpenAI API key to enable chat functionality"
                        }
                      </p>
                    </div>
                  ) : (
                    chatMessages.map(message => (
                      <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm font-[Roboto] whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder={apiKeyConfigured ? "Ask about SEO, linking strategy..." : "API key required"}
                    disabled={!apiKeyConfigured}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Roboto] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || !apiKeyConfigured}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI-Powered Action Recommendations */}
      {selectedPost && aiInsights && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-purple-900 font-[Anton] uppercase">
              Recommended Actions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.recommendedActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-700 font-[Roboto]">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-[Anton] uppercase">
          How to Use This AI-Enhanced Tool
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 font-[Roboto]">1. Configure & Analyze</h4>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Add your OpenAI API key, select your post, and let AI analyze content relationships and SEO opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 font-[Roboto]">2. Review AI Insights</h4>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Get strategic insights about content gaps, linking strategies, and optimization opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 font-[Roboto]">3. Chat for Custom Advice</h4>
            <p className="text-sm text-gray-600 font-[Roboto]">
              Ask the AI assistant specific questions about SEO strategy, content optimization, and best practices.
            </p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          {/* API Setup Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3 font-[Roboto]">🔑 Setting Up OpenAI API</h4>
            <ol className="text-sm text-blue-800 space-y-2 font-[Roboto]">
              <li>1. Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">platform.openai.com</a></li>
              <li>2. Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root</li>
              <li>3. Add: <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here</code></li>
              <li>4. Restart your development server</li>
              <li>5. The AI features will automatically activate</li>
            </ol>
          </div>

          {/* Cost Management */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2 font-[Roboto]">💰 API Cost Management</h4>
            <ul className="text-sm text-yellow-800 space-y-1 font-[Roboto]">
              <li>• AI insights: ~$0.02-0.05 per analysis</li>
              <li>• Chat messages: ~$0.01-0.03 per interaction</li>
              <li>• Set usage limits in OpenAI dashboard</li>
              <li>• Consider caching insights for repeated analyses</li>
            </ul>
          </div>

          {/* Advanced Features */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2 font-[Roboto]">🚀 Advanced Features</h4>
            <ul className="text-sm text-green-800 space-y-1 font-[Roboto]">
              <li>• Ask about specific SEO strategies for your niche</li>
              <li>• Get content gap analysis and topic suggestions</li>
              <li>• Receive anchor text optimization recommendations</li>
              <li>• Plan content clusters and site architecture</li>
              <li>• Analyze competitor linking strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOInterlinkingTool;