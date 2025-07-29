// lib/wordpress.js
// GraphQL client for WordPress API

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/graphql'

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  // If using authentication (optional)
  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
  }

  const res = await fetch(WORDPRESS_API_URL, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

// GraphQL Queries

export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          date
          modified
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          # ACF Fields
          acfBlogFields {
            readTime
            featured
            customExcerpt
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_FEATURED_POSTS = `
  query GetFeaturedPosts {
    posts(first: 4, where: { status: PUBLISH, metaQuery: { metaArray: [{ key: "featured", value: "1", compare: EQUAL }] } }) {
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
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featured
            customExcerpt
          }
        }
      }
    }
  }
`

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      slug
      excerpt
      date
      modified
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      acfBlogFields {
        readTime
        featured
        customExcerpt
      }
    }
  }
`

export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int = 20) {
    posts(first: $first, where: { search: $search, status: PUBLISH }) {
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
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featured
            customExcerpt
          }
        }
      }
    }
  }
`

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categoryName: String!, $first: Int = 20) {
    posts(first: $first, where: { categoryName: $categoryName, status: PUBLISH }) {
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
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featured
            customExcerpt
          }
        }
      }
    }
  }
`

export const GET_CATEGORIES = `
  query GetCategories {
    categories(first: 20, where: { hideEmpty: true }) {
      edges {
        node {
          id
          name
          slug
          count
        }
      }
    }
  }
`

// API Functions

export async function getAllPosts(first = 20, after = null) {
  const data = await fetchAPI(GET_ALL_POSTS, {
    variables: { first, after }
  })
  return data?.posts || { edges: [], pageInfo: {} }
}

export async function getFeaturedPosts() {
  const data = await fetchAPI(GET_FEATURED_POSTS)
  return data?.posts?.edges || []
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(GET_POST_BY_SLUG, {
    variables: { slug }
  })
  return data?.postBy
}

export async function searchPosts(searchTerm, first = 20) {
  const data = await fetchAPI(SEARCH_POSTS, {
    variables: { search: searchTerm, first }
  })
  return data?.posts || { edges: [] }
}

export async function getPostsByCategory(categoryName, first = 20) {
  const data = await fetchAPI(GET_POSTS_BY_CATEGORY, {
    variables: { categoryName, first }
  })
  return data?.posts || { edges: [] }
}

export async function getCategories() {
  const data = await fetchAPI(GET_CATEGORIES)
  return data?.categories?.edges || []
}

// Utility Functions

export function formatPostData(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.acfBlogFields?.customExcerpt || post.excerpt?.replace(/<[^>]*>/g, '') || '',
    category: post.categories?.edges?.[0]?.node?.name || 'Uncategorized',
    categorySlug: post.categories?.edges?.[0]?.node?.slug || 'uncategorized',
    readTime: post.acfBlogFields?.readTime || '5 min read',
    date: new Date(post.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    image: post.featuredImage?.node?.sourceUrl || '/images/blog/default.jpg',
    imageAlt: post.featuredImage?.node?.altText || post.title,
    featured: post.acfBlogFields?.featured || false,
    content: post.content || ''
  }
}

export function getCategoryMapping() {
  return {
    'habit-formation': 'Habit Formation',
    'digital-wellness': 'Digital Wellness',
    'productivity': 'Productivity',
    'psychology': 'Psychology',
    'mindfulness': 'Mindfulness'
  }
}

// Environment Variables needed:
// NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
// WORDPRESS_AUTH_REFRESH_TOKEN=your-token-if-needed (optional)