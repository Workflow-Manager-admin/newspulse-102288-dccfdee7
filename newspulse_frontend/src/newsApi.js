//
// NewsAPI.org integration helper for NewsPulse
// Provides a function to fetch articles by category.
// Handles API key, endpoint, error conditions, and transforms results.
//

const API_KEY = '752d30fff1124135a2ecb248c652fe37';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

/**
 * Maps NewsPulse categories to NewsAPI.org categories
 */
const CATEGORY_API_MAP = {
  Technology: 'technology',
  Politics: 'politics',
  Health: 'health',
  Sports: 'sports',
  Entertainment: 'entertainment'
};

/**
 * PUBLIC_INTERFACE
 * Fetch news articles from NewsAPI.org for a specific category.
 * @param {string} category - NewsPulse category ("All", "Technology", ...)
 * @returns {Promise<{articles: Array, error: string|null}>}
 */
export async function fetchNews(category = "All") {
  let url = BASE_URL + '?country=us&pageSize=30';
  if (category && category !== "All" && CATEGORY_API_MAP[category]) {
    url += `&category=${encodeURIComponent(CATEGORY_API_MAP[category])}`;
  }
  try {
    const res = await fetch(url, {
      headers: { 'X-Api-Key': API_KEY }
    });
    if (!res.ok) {
      let msg = `Error: ${res.status}`;
      try {
        const errData = await res.json();
        if (errData?.message) msg += ` - ${errData.message}`;
      } catch (e) { /* ignore parse error */ }
      return { articles: [], error: msg };
    }
    const data = await res.json();
    // NewsAPI returns { status, totalResults, articles }
    if (!data || !Array.isArray(data.articles)) {
      return { articles: [], error: 'Malformed response from NewsAPI.' };
    }
    // Convert articles to NewsPulse app format
    const now = new Date();
    const processed = data.articles.map((a, i) => {
      // Attempt to parse time ago for UI friendliness
      let time = '';
      if (a.publishedAt) {
        const pub = new Date(a.publishedAt);
        const mins = Math.floor((now - pub) / 60000);
        time = mins < 60 ? `${mins}m ago` : `${Math.floor(mins/60)}h ago`;
      }
      return {
        id: a.url || `${a.title}-${i}`,
        title: a.title || "Untitled",
        source: (a.source && a.source.name) || "Unknown",
        time: time,
        thumbnail: a.urlToImage || 'https://placehold.co/80x80/1A73E8/FFFFFF?text=News',
        content: a.content || a.description || "No content excerpt available.",
        summary: "", // To be filled by AI summarizer if used
        url: a.url
      };
    });
    return { articles: processed, error: null };
  } catch (e) {
    return { articles: [], error: "Unable to fetch news. Please check your network connection." };
  }
}
