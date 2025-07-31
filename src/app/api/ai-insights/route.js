// src/app/api/ai-insights/route.js
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only - no NEXT_PUBLIC_
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;
    
    if (type === 'insights') {
      const { post, suggestions } = body;
      
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
      return NextResponse.json(aiResponse);
    }
    
    if (type === 'chat') {
      const { message, context, chatHistory } = body;
      
      const contextPrompt = context ? `
      CURRENT CONTEXT:
      ${context}
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
          ...(chatHistory || []),
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 600,
        temperature: 0.8
      });

      return NextResponse.json({ 
        content: response.choices[0].message.content 
      });
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI API Error:', error);
    
    // Return helpful fallback data instead of just error
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'AI service temporarily unavailable',
        fallback: {
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
        }
      },
      { status: 500 }
    );
  }
}