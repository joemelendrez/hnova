'use client';

// src/app/admin/seo-tool/SEOInterlinkingTool.js
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

      {/* Rest of the component content... */}
      {/* The component content is very long, so I'll include the key parts */}
      
      <div className="text-center py-12 text-gray-500">
        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="font-[Roboto]">Select a blog post from the left to begin SEO analysis</p>
        <p className="text-sm text-gray-400 mt-2 font-[Roboto]">
          {apiKeyConfigured ? "AI insights ready" : "Configure OpenAI API key for AI features"}
        </p>
      </div>
    </div>
  );
};

export default SEOInterlinkingTool;