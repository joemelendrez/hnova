// src/app/blog/[slug]/page.js
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  getPostBySlug,
  getAllPosts,
  getPostsByCategory,
  formatPostData,
} from '@/lib/wordpress';
import BlogPostClient from '@/components/BlogPostClient';
import BlogPostSkeleton from '@/components/BlogPostSkeleton';

// Production caching strategy
export const revalidate = 3600; // 1 hour cache
export const dynamic = 'force-static'; // Pre-generate at build time
export const dynamicParams = true; // Allow new posts without rebuild

// Generate static params for all blog posts with error handling
export async function generateStaticParams() {
  try {
    console.log('🔄 Generating static params for blog posts...');
    const posts = await getAllPosts(100); // Get more posts for static generation

    if (!posts?.edges || posts.edges.length === 0) {
      console.warn('⚠️ No posts found for static generation');
      return [];
    }

    const params = posts.edges
      .filter((edge) => edge?.node?.slug) // Filter out invalid posts
      .map((edge) => ({
        slug: edge.node.slug,
      }));

    console.log(`✅ Generated ${params.length} static params`);
    return params;
  } catch (error) {
    console.error('❌ Error generating static params:', error);
    return [];
  }
}

// Enhanced metadata generation with comprehensive SEO
export async function generateMetadata({ params }) {
  const { slug } = params;

  // Validate slug format
  if (!slug || typeof slug !== 'string' || slug.length > 200) {
    return {
      title: 'Invalid Post | Habit Nova',
      description: 'The requested blog post URL is invalid.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    console.log(`🔍 Generating metadata for: ${slug}`);
    const post = await getPostBySlug(slug);

    if (!post) {
      console.log(`❌ Post not found for metadata: ${slug}`);
      return {
        title: 'Post Not Found | Habit Nova',
        description: 'The requested blog post could not be found.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const formattedPost = formatPostData(post);

    // Enhanced metadata with fallbacks
    const title = formattedPost.title || 'Blog Post';
    const description =
      formattedPost.excerpt ||
      'Evidence-based insights on habit formation and behavior change from Habit Nova.';
    const canonicalUrl = `https://habitnova.com/blog/${slug}`;

    console.log(`✅ Generated metadata for: ${title}`);

    return {
      title: `${title} | Habit Nova`,
      description,

      // Enhanced keywords
      keywords: [
        'habits',
        'behavior change',
        'psychology',
        'productivity',
        'habit formation',
        'self improvement',
        formattedPost.category?.toLowerCase(),
        ...title
          .split(' ')
          .filter((word) => word.length > 3)
          .slice(0, 5),
      ].join(', '),

      // Author information
      authors: [{ name: 'Habit Nova Team' }],

      // Open Graph metadata
      openGraph: {
        title: `${title} | Habit Nova`,
        description,
        url: canonicalUrl,
        siteName: 'Habit Nova',
        locale: 'en_US',
        type: 'article',
        publishedTime: post.date
          ? new Date(post.date).toISOString()
          : undefined,
        modifiedTime: post.modified
          ? new Date(post.modified).toISOString()
          : undefined,
        authors: ['Habit Nova Team'],
        section: formattedPost.category || 'Habits',
        tags: [
          formattedPost.category,
          'habits',
          'behavior change',
          'psychology',
          'productivity',
        ].filter(Boolean),
        images: [
          {
            url: formattedPost.image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },

      // Twitter metadata
      twitter: {
        card: 'summary_large_image',
        site: '@habitnova',
        creator: '@habitnova',
        title: `${title} | Habit Nova`,
        description,
        images: [formattedPost.image],
      },

      // Canonical URL
      alternates: {
        canonical: canonicalUrl,
      },

      // Robots configuration
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Additional meta tags
      category: formattedPost.category || 'Habits',

      // Article-specific meta tags
      other: {
        'article:published_time': post.date
          ? new Date(post.date).toISOString()
          : undefined,
        'article:modified_time': post.modified
          ? new Date(post.modified).toISOString()
          : undefined,
        'article:author': 'Habit Nova Team',
        'article:section': formattedPost.category || 'Habits',
        'article:tag': [formattedPost.category, 'habits', 'behavior change']
          .filter(Boolean)
          .join(', '),
      },
    };
  } catch (error) {
    console.error(`❌ Error generating metadata for ${slug}:`, error);

    // Fallback metadata
    return {
      title: 'Blog Post | Habit Nova',
      description:
        'Evidence-based insights on habit formation and behavior change from Habit Nova.',
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

// Enhanced related posts fetching
async function getRelatedPosts(post, maxPosts = 3) {
  try {
    console.log(`🔗 Fetching related posts for: ${post.title}`);

    // Try to get posts from the same category first
    if (post.categorySlug) {
      const categoryPosts = await getPostsByCategory(
        post.categorySlug,
        maxPosts + 3
      );

      if (categoryPosts?.edges) {
        const relatedFromCategory = categoryPosts.edges
          .map((edge) => formatPostData(edge.node))
          .filter((relatedPost) => relatedPost.slug !== post.slug) // Exclude current post
          .slice(0, maxPosts);

        if (relatedFromCategory.length >= maxPosts) {
          console.log(
            `✅ Found ${relatedFromCategory.length} related posts from category`
          );
          return relatedFromCategory;
        }
      }
    }

    // Fallback: get recent posts if not enough category matches
    console.log('🔄 Falling back to recent posts for related content');
    const recentPosts = await getAllPosts(maxPosts + 3);

    if (recentPosts?.edges) {
      const relatedPosts = recentPosts.edges
        .map((edge) => formatPostData(edge.node))
        .filter((relatedPost) => relatedPost.slug !== post.slug)
        .slice(0, maxPosts);

      console.log(
        `✅ Found ${relatedPosts.length} recent posts as related content`
      );
      return relatedPosts;
    }

    return [];
  } catch (error) {
    console.error('❌ Error fetching related posts:', error);
    return [];
  }
}

// Main page component with comprehensive error handling
export default async function BlogPostPage({ params }) {
  const { slug } = params;

  // Validate slug format
  if (!slug || typeof slug !== 'string' || slug.length > 200) {
    console.log(`❌ Invalid slug format: ${JSON.stringify(slug)}`);
    notFound();
  }

  try {
    console.log(`📖 Loading blog post: ${slug}`);

    // Fetch the main post
    const post = await getPostBySlug(slug);

    if (!post) {
      console.log(`❌ Post not found: ${slug}`);
      notFound();
    }

    const formattedPost = formatPostData(post);
    console.log(`✅ Post loaded: ${formattedPost.title}`);

    // Fetch related posts with error handling
    let relatedPosts = [];
    try {
      relatedPosts = await getRelatedPosts(formattedPost, 3);
    } catch (relatedError) {
      console.warn('⚠️ Failed to fetch related posts:', relatedError);
      // Continue without related posts rather than failing entirely
    }

    return (
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogPostClient post={formattedPost} relatedPosts={relatedPosts} />
      </Suspense>
    );
  } catch (error) {
    console.error(`❌ Error loading blog post ${slug}:`, error);

    // Check if it's a network/API error vs missing post
    if (error.message?.includes('not found') || error.status === 404) {
      notFound();
    }

    // For other errors, still show 404 but log for debugging
    console.error('Unexpected error in blog post page:', error);
    notFound();
  }
}

// Optional: Add JSON-LD structured data for better SEO
export function generateJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Organization',
      name: 'Habit Nova',
      url: 'https://habitnova.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Habit Nova',
      logo: {
        '@type': 'ImageObject',
        url: 'https://habitnova.com/logos/Habitlogo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://habitnova.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: [post.category, 'habits', 'behavior change', 'psychology'].filter(
      Boolean
    ),
  };
}
