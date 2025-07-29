// src/app/blog/[slug]/page.js
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, formatPostData } from '@/lib/wordpress'
import BlogPostClient from '@/components/BlogPostClient'

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(100) // Get more posts for static generation
    
    return posts.edges.map((edge) => ({
      slug: edge.node.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each post
export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(params.slug)
    
    if (!post) {
      return {
        title: 'Post Not Found | Habit Nova',
        description: 'The requested blog post could not be found.'
      }
    }

    const formattedPost = formatPostData(post)
    
    return {
      title: `${formattedPost.title} | Habit Nova`,
      description: formattedPost.excerpt || 'Evidence-based insights on habit formation and behavior change.',
      openGraph: {
        title: formattedPost.title,
        description: formattedPost.excerpt,
        images: [
          {
            url: formattedPost.image,
            width: 1200,
            height: 630,
            alt: formattedPost.title,
          },
        ],
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        modifiedTime: new Date(post.modified).toISOString(),
        authors: ['Habit Nova'],
        section: formattedPost.category,
        tags: [formattedPost.category, 'habits', 'behavior change', 'psychology'],
      },
      twitter: {
        card: 'summary_large_image',
        title: formattedPost.title,
        description: formattedPost.excerpt,
        images: [formattedPost.image],
      },
      keywords: [
        'habits',
        'behavior change',
        'psychology',
        'productivity',
        formattedPost.category.toLowerCase(),
        ...formattedPost.title.split(' ').filter(word => word.length > 3)
      ].join(', '),
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post | Habit Nova',
      description: 'Evidence-based insights on habit formation and behavior change.'
    }
  }
}

// Main page component
export default async function BlogPostPage({ params }) {
  try {
    const post = await getPostBySlug(params.slug)
    
    if (!post) {
      notFound()
    }

    const formattedPost = formatPostData(post)
    
    // Get related posts (same category, excluding current post)
    const relatedPosts = await getAllPosts(6)
    const filteredRelatedPosts = relatedPosts.edges
      .map(edge => formatPostData(edge.node))
      .filter(relatedPost => 
        relatedPost.id !== formattedPost.id && 
        relatedPost.category === formattedPost.category
      )
      .slice(0, 3)

    return (
      <BlogPostClient 
        post={formattedPost} 
        relatedPosts={filteredRelatedPosts}
      />
    )
  } catch (error) {
    console.error('Error loading blog post:', error)
    notFound()
  }
}