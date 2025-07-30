// src/lib/wordpress.js
// GraphQL client for WordPress API with improved error handling

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://your-wordpress-site.com/graphql';

async function fetchAPI(query, { variables } = {}) {
  // Check if WordPress URL is configured
  if (
    !process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ===
      'https://your-wordpress-site.com/graphql'
  ) {
    console.warn(
      'WordPress API URL not configured. Please set NEXT_PUBLIC_WORDPRESS_API_URL in .env.local'
    );
    throw new Error('WordPress API URL not configured');
  }

  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(
        `GraphQL error: ${json.errors[0]?.message || 'Unknown error'}`
      );
    }

    return json.data;
  } catch (error) {
    console.error('WordPress API Error:', error.message);
    throw error;
  }
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
`;

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
`;

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
`;

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
`;

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
`;

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
`;

// API Functions with fallback data
export async function getAllPosts(first = 20, after = null) {
  try {
    const data = await fetchAPI(GET_ALL_POSTS, {
      variables: { first, after },
    });
    return data?.posts || { edges: [], pageInfo: {} };
  } catch (error) {
    console.error('Error fetching all posts:', error.message);
    // Return fallback data for development
    return getFallbackPosts(first);
  }
}

export async function getFeaturedPosts() {
  try {
    const data = await fetchAPI(GET_FEATURED_POSTS);
    return data?.posts?.edges || [];
  } catch (error) {
    console.error('Error fetching featured posts:', error.message);
    // Return fallback data for development
    return getFallbackPosts(4).edges;
  }
}

export async function getPostBySlug(slug) {
  try {
    const data = await fetchAPI(GET_POST_BY_SLUG, {
      variables: { slug },
    });
    return data?.postBy;
  } catch (error) {
    console.error('Error fetching post by slug:', error.message);
    return null;
  }
}

export async function searchPosts(searchTerm, first = 20) {
  try {
    const data = await fetchAPI(SEARCH_POSTS, {
      variables: { search: searchTerm, first },
    });
    return data?.posts || { edges: [] };
  } catch (error) {
    console.error('Error searching posts:', error.message);
    return { edges: [] };
  }
}

export async function getPostsByCategory(categoryName, first = 20) {
  try {
    const data = await fetchAPI(GET_POSTS_BY_CATEGORY, {
      variables: { categoryName, first },
    });
    return data?.posts || { edges: [] };
  } catch (error) {
    console.error('Error fetching posts by category:', error.message);
    return { edges: [] };
  }
}

export async function getCategories() {
  try {
    const data = await fetchAPI(GET_CATEGORIES);
    return data?.categories?.edges || [];
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    // Return fallback categories
    return [
      { node: { name: 'Habit Formation', slug: 'habit-formation' } },
      { node: { name: 'Digital Wellness', slug: 'digital-wellness' } },
      { node: { name: 'Productivity', slug: 'productivity' } },
      { node: { name: 'Psychology', slug: 'psychology' } },
      { node: { name: 'Mindfulness', slug: 'mindfulness' } },
    ];
  }
}

// Utility Functions
export function formatPostData(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt:
      post.acfBlogFields?.customExcerpt ||
      post.excerpt?.replace(/<[^>]*>/g, '') ||
      '',
    category: post.categories?.edges?.[0]?.node?.name || 'Uncategorized',
    categorySlug: post.categories?.edges?.[0]?.node?.slug || 'uncategorized',
    readTime: post.acfBlogFields?.readTime || '5 min read',
    date: new Date(post.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    // Use placeholder image service for development
    image:
      post.featuredImage?.node?.sourceUrl ||
      'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=600&h=400&fit=crop&crop=center',
    imageAlt: post.featuredImage?.node?.altText || post.title,
    featured: post.acfBlogFields?.featured || false,
    content: post.content || '',
  };
}

// Fallback data for development when WordPress is not available
function getFallbackPosts(count = 20) {
  const fallbackPosts = [
    {
      node: {
        id: 'fallback-1',
        title: 'The 2-Minute Rule: Why Starting Small Leads to Big Changes',
        slug: 'the-2-minute-rule-why-starting-small-leads-to-big-changes',
        excerpt:
          'Discover how breaking habits down into 2-minute actions can create lasting transformation in your life.',
        date: '2024-12-15T00:00:00',
        categories: {
          edges: [
            { node: { name: 'Habit Formation', slug: 'habit-formation' } },
          ],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
            altText: 'Person writing in journal',
          },
        },
        acfBlogFields: {
          readTime: '5 min read',
          featured: true,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-2',
        title: 'Breaking the Dopamine Loop: Understanding Digital Addiction',
        slug: 'breaking-the-dopamine-loop-understanding-digital-addiction',
        excerpt:
          'Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.',
        date: '2024-12-12T00:00:00',
        categories: {
          edges: [
            { node: { name: 'Digital Wellness', slug: 'digital-wellness' } },
          ],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
            altText: 'Smartphone and laptop',
          },
        },
        acfBlogFields: {
          readTime: '8 min read',
          featured: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-3',
        title: 'The Habit Stacking Method: Building New Routines That Stick',
        slug: 'the-habit-stacking-method-building-new-routines-that-stick',
        excerpt:
          'How to link new habits to existing ones for automatic behavior change.',
        date: '2024-12-10T00:00:00',
        categories: {
          edges: [{ node: { name: 'Productivity', slug: 'productivity' } }],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
            altText: 'Stack of books',
          },
        },
        acfBlogFields: {
          readTime: '6 min read',
          featured: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-4',
        title: 'Why Willpower Fails (And What Actually Works)',
        slug: 'why-willpower-fails-and-what-actually-works',
        excerpt:
          'The surprising science behind why relying on willpower alone sabotages your habit change efforts.',
        date: '2024-12-08T00:00:00',
        categories: {
          edges: [{ node: { name: 'Psychology', slug: 'psychology' } }],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
            altText: 'Brain illustration',
          },
        },
        acfBlogFields: {
          readTime: '7 min read',
          featured: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
  ];

  return {
    edges: fallbackPosts.slice(0, count),
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}
