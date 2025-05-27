import React, { useState, useEffect } from 'react';
import './App.css';
import ArticleDetail from "./ArticleDetail";
import CustomSummarizer from "./CustomSummarizer";

/*
  NewsPulse main container for web (React)
  ----------------------------------------
  Features scaffolded and commented for production-readiness:
   - Live News Feed (API integration stub)
   - Category Filters
   - AI Article Summarization (placeholder)
   - Bookmarks (local state)
   - User Preferences Onboarding (simple preferences modal, stub)
   - Push Notifications (UI placeholder)
   - Dark Mode Toggle
  [Production: Extract components to separate files for scale.]
*/

// --- THEME COLORS (Inject custom theme variables as needed):
const CUSTOM_COLORS = {
  primary: '#1A73E8',
  secondary: '#FFFFFF',
  accent: '#FF5252',
  // Add more if needed
};

import { fetchNews } from "./newsApi";

// --- MOCK DATA/PLACEHOLDERS (replace with API responses):
const CATEGORIES = ['All', 'Technology', 'Politics', 'Health', 'Sports', 'Entertainment'];

// ---- MAIN APP START ----

// PUBLIC_INTERFACE
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  // Split to allNews (all articles) and displayedNews (filtered)
  const [allNews, setAllNews] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);

  // Persistent bookmark (localStorage) helpers
  // PUBLIC_INTERFACE
  function loadBookmarks() {
    try {
      const saved = localStorage.getItem('bookmarkedNews');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      // Stub: If localStorage isn't available or fails, use empty array (future: handle errors or server fallback)
      return [];
    }
  }
  // PUBLIC_INTERFACE
  function saveBookmarks(bookmarks) {
    try {
      localStorage.setItem('bookmarkedNews', JSON.stringify(bookmarks));
    } catch (e) {
      // Stub: Ignore on error for now, can be expanded for backend/session fallback
    }
  }

  const [bookmarked, setBookmarked] = useState(() => loadBookmarks());
  // include summarizer tab
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'bookmarks' | 'summarizer' | 'settings'

  // Manage loading and error for fetching news
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // Fetch news from NewsAPI when selectedCategories changes, or at mount
  useEffect(() => {
    let isActive = true;
    async function load() {
      setLoadingNews(true);
      setNewsError(null);
      setDisplayedNews([]);
      // Use only the first selected category (API does not support multi categories at once)
      const effectiveCat =
        selectedCategories && selectedCategories.length > 0
          ? (selectedCategories[0] === "All" ? "All" : selectedCategories[0])
          : "All";
      const { articles, error } = await fetchNews(effectiveCat);
      if (!isActive) return;
      setAllNews(articles || []);
      setDisplayedNews(articles || []);
      setNewsError(error);
      setLoadingNews(false);
    }
    load();
    return () => {
      isActive = false;
    };
  }, [selectedCategories]);

  useEffect(() => {
    // Retain any logic required for using filtered views if supporting more advanced filters later
    setDisplayedNews(allNews);
  }, [allNews]);

  // Persist bookmarks (via stub function)
  useEffect(() => {
    saveBookmarks(bookmarked);
  }, [bookmarked]);

  // Apply dark/light theme dynamically
  useEffect(() => {
    document.body.style.background = darkMode ? 'var(--kavia-dark)' : '#f6f9fc';
    document.body.style.color = darkMode ? 'var(--text-color)' : '#08090a';
  }, [darkMode]);

  // ---- CORE UI RENDER ----
  return (
    <div className="app" style={{ minHeight: '100vh', background: darkMode ? 'var(--kavia-dark)' : '#f6f9fc' }}>
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSettings={() => setShowPreferences(true)}
      />

      {/* CATEGORY FILTER BAR */}
      <CategoryFilterBar
        categories={CATEGORIES}
        selected={selectedCategories}
        setSelected={setSelectedCategories}
        darkMode={darkMode}
      />

      {/* MAIN CONTENT AREA */}
      <main className="main-content-area" style={{ flex: 1, marginTop: 88, marginBottom: 64, transition: 'background 0.2s' }}>
        {activeTab === 'home' && !selectedNewsId && (
          <NewsFeed
            news={displayedNews}
            selectedCategories={selectedCategories}
            onSelect={setSelectedNewsId}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            darkMode={darkMode}
            loading={loadingNews}
            error={newsError}
          />
        )}

        {activeTab === 'home' && selectedNewsId && (
          <ArticleDetail
            article={allNews.find(n => n.id === selectedNewsId)}
            onBack={() => setSelectedNewsId(null)}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            darkMode={darkMode} // pass darkMode prop for styling
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkedArticles
            news={allNews}
            bookmarks={bookmarked}
            onSelect={setSelectedNewsId}
            setBookmarked={setBookmarked}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'summarizer' && (
          <div className="container" style={{ paddingTop: 28, paddingBottom: 12 }}>
            <CustomSummarizer darkMode={darkMode} />
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            onShowPreferences={() => setShowPreferences(true)}
            // Push notification setup UI placeholder here
            darkMode={darkMode}
          />
        )}
      </main>

      {/* PREFERENCES ONBOARDING MODAL */}
      {showPreferences && (
        <PreferencesModal
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          onClose={() => setShowPreferences(false)}
          allCategories={CATEGORIES}
        />
      )}

      {/* BOTTOM NAVIGATION */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          setSelectedNewsId(null); // Close detail view when switching tabs
        }}
        showSummarizer
      />
    </div>
  );
}

// ---- NAVIGATION & LAYOUT COMPONENTS ----

function TopBar({ darkMode, setDarkMode, onSettings }) {
  return (
    <nav className="navbar" style={{ background: darkMode ? 'var(--kavia-dark)' : CUSTOM_COLORS.secondary }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
          <span className="logo-symbol" style={{ color: CUSTOM_COLORS.primary, fontWeight: 900, fontSize: 26 }}>📰</span>{" "}
          NewsPulse
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn"
            onClick={() => setDarkMode(v => !v)}
            aria-label="Toggle dark mode"
            style={{
              background: darkMode ? CUSTOM_COLORS.primary : CUSTOM_COLORS.accent,
              color: '#fff',
              borderRadius: '50%',
              width: 38,
              height: 38,
              fontSize: 18,
              lineHeight: 1,
              boxShadow: darkMode ? '0 0 8px #111' : '0 0 4px #aaa',
            }}>
            {darkMode ? "🌙" : "☀️"}
          </button>
          <button className="btn" style={{ background: CUSTOM_COLORS.primary, color: '#fff' }} onClick={onSettings}>
            Preferences
          </button>
        </div>
      </div>
    </nav>
  );
}

// CATEGORY FILTER BAR
function CategoryFilterBar({ categories, selected, setSelected, darkMode }) {
  return (
    <div className="category-filter-bar" style={{
      display: 'flex',
      overflowX: 'auto',
      padding: '14px 0 8px 0',
      background: darkMode ? 'var(--kavia-dark)' : CUSTOM_COLORS.secondary,
      borderBottom: `1px solid ${darkMode ? 'var(--border-color)' : '#e4e9ef'}`,
      position: 'sticky', top: 64, zIndex: 10
    }}>
      <div className="container" style={{ display: 'flex', gap: 8 }}>
        {categories.map(cat => (
          <button
            key={cat}
            className="btn"
            style={{
              padding: '7px 18px',
              fontWeight: selected.includes(cat) ? 700 : 500,
              background: selected.includes(cat)
                ? (darkMode ? CUSTOM_COLORS.primary : CUSTOM_COLORS.accent)
                : 'transparent',
              color: selected.includes(cat)
                ? CUSTOM_COLORS.secondary
                : darkMode ? CUSTOM_COLORS.secondary : '#222',
              border: selected.includes(cat)
                ? `2px solid ${CUSTOM_COLORS.primary}`
                : `1px solid ${darkMode ? 'var(--border-color)' : '#e4e9ef'}`,
              borderRadius: 18,
              minWidth: 80,
              cursor: 'pointer',
            }}
            onClick={() => {
              // "All" resets
              if (cat === "All") {
                setSelected(['All']);
              } else {
                // Remove 'All' if other selected
                const newSel = selected.includes(cat)
                  ? selected.filter(item => item !== cat && item !== "All")
                  : [...selected.filter(item => item !== "All"), cat];
                setSelected(newSel.length === 0 ? ["All"] : newSel);
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

// MAIN NEWS FEED
/**
 * NewsFeed: Renders the supplied (already filtered) list of articles.
 * Filtering is done by parent component.
 */
function NewsFeed({ news, selectedCategories, onSelect, bookmarked, setBookmarked, darkMode, loading, error }) {
  const [expandedId, setExpandedId] = React.useState(null);
  const [loadingSummaryId, setLoadingSummaryId] = React.useState(null);
  const [summaries, setSummaries] = React.useState({});

  // Filtering is now done in parent, so just use news prop
  const filteredNews = news;

  // Stubbed summary fetch, replace with real API call in future
  const fetchSummary = async (article) => {
    setLoadingSummaryId(article.id);
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("📝 [AI SUMMARY]: " + (article.summary || "A short summary will appear here from the AI service."));
      }, 900);
    });
  };

  const handleSummarize = async (article) => {
    setExpandedId(article.id);
    if (!summaries[article.id]) {
      const summaryText = await fetchSummary(article);
      setSummaries(prev => ({ ...prev, [article.id]: summaryText }));
    }
    setLoadingSummaryId(null);
  };

  return (
    <div className="container">
      {loading && (
        <div style={{
          color: darkMode ? "#fff" : "#111",
          textAlign: "center",
          padding: "64px 0 38px 0",
          fontSize: 20,
          letterSpacing: 0.2
        }}>
          <span role="status" style={{ fontSize: 34 }}>⏳</span>
          <div>Loading latest news…</div>
        </div>
      )}
      {error && !loading && (
        <div style={{
          color: "#F44",
          background: darkMode ? "#221829" : "#ffeaea",
          textAlign: "center",
          borderRadius: 10,
          padding: "42px 14px",
          margin: "24px auto",
          fontWeight: 600,
          maxWidth: 480,
          boxShadow: darkMode ? "0 4px 22px #09052128" : "0 1px 6px #c2232348"
        }}>
          <span style={{ fontSize: 29, marginBottom: 9, display: "inline-block" }}>⚠️</span><br />
          {error}
        </div>
      )}
      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0' }}>
          {filteredNews.map(article => {
            const isExpanded = expandedId === article.id;
            return (
              <li key={article.id} style={{
                marginBottom: 24,
                background: darkMode ? '#23252b' : '#fff',
                borderRadius: 14,
                boxShadow: darkMode
                  ? '0 2px 12px rgba(20,20,30,0.25)'
                  : '0 1px 7px rgba(32,32,42,0.09)',
                display: 'flex',
                flexDirection: 'column',
                cursor: isExpanded ? 'default' : 'pointer',
                padding: 0,
                border: '1px solid #25293608',
                transition: 'box-shadow 0.18s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => !isExpanded && setExpandedId(article.id)}>
                  <img src={article.thumbnail}
                       alt="Thumbnail"
                       style={{
                         width: 78,
                         height: 78,
                         objectFit: 'cover',
                         borderTopLeftRadius: 14,
                         borderBottomLeftRadius: 14,
                       }}
                  />
                  <div style={{ flex: 1, padding: 14, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: 19,
                        color: darkMode ? '#fff' : '#111',
                        fontWeight: 600,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                      {article.title}
                    </h3>
                    <div style={{ color: darkMode ? CUSTOM_COLORS.secondary : '#424a', fontSize: 13, display: 'flex', gap: 8 }}>
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.time}</span>
                    </div>
                  </div>
                  <button
                    className="btn"
                    onClick={e => {
                      e.stopPropagation();
                      setBookmarked(prev => prev.includes(article.id)
                        ? prev.filter(id => id !== article.id)
                        : [...prev, article.id]
                      );
                    }}
                    style={{
                      background: bookmarked.includes(article.id) ? CUSTOM_COLORS.accent : 'transparent',
                      color: bookmarked.includes(article.id) ? '#fff' : (darkMode ? '#fff' : '#333'),
                      boxShadow: 'none',
                      border: 'none',
                      borderRight: '1px solid transparent',
                      borderRadius: '50%',
                      width: 34,
                      height: 34,
                      fontSize: 18,
                      marginRight: 10,
                      cursor: 'pointer',
                    }}
                    aria-label={bookmarked.includes(article.id) ? "Remove Bookmark" : "Add Bookmark"}
                  >{bookmarked.includes(article.id) ? '★' : '☆'}</button>
                  {/* Summarize Button */}
                  <button
                    className="btn"
                    style={{
                      background: CUSTOM_COLORS.primary,
                      color: '#fff',
                      fontWeight: 500,
                      marginRight: 14,
                      marginLeft: 8,
                      minWidth: 80,
                    }}
                    tabIndex={0}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleSummarize(article);
                    }}
                    aria-label={`Summarize article ${article.title}`}>
                    {isExpanded
                      ? (loadingSummaryId === article.id ? "Summarizing..." : "Summarized")
                      : (loadingSummaryId === article.id ? "Summarizing..." : "Summarize")
                    }
                  </button>
                </div>
                {isExpanded && (
                  <div style={{
                    width: '100%',
                    padding: '18px 24px 6px 24px',
                    borderTop: darkMode ? '1px solid #232536' : '1px solid #e2e7f3',
                    background: darkMode ? '#1a1d2f' : '#f5f8fe',
                    borderBottomLeftRadius: 14,
                    borderBottomRightRadius: 14,
                    marginTop: 3
                  }}>
                    {/* Full Article Content */}
                    <div style={{ color: darkMode ? '#ccc' : '#1a1932', fontSize: 15, marginBottom: 12 }}>
                      {article.content}
                    </div>
                    {/* Inline AI Summary Display */}
                    <div style={{
                      background: darkMode ? '#23294b' : '#eceeff',
                      borderRadius: 8,
                      color: darkMode ? '#e2e9f7' : '#24293f',
                      boxShadow: '0 1px 5px rgba(32,32,60,0.06)',
                      padding: '10px 13px',
                      fontSize: 15,
                      marginBottom: 5,
                      minHeight: 34
                    }}>
                      <b>AI Summary:</b>
                      <div style={{ marginTop: 7, minHeight: 16 }}>
                        {loadingSummaryId === article.id
                          ? <span><i>Generating summary...</i></span>
                          : summaries[article.id] 
                            ? summaries[article.id]
                            : <span style={{ color: '#FF5252' }}>[Summary will appear here after clicking Summarize]</span>
                        }
                      </div>
                    </div>
                    <button
                      className="btn"
                      style={{ margin: '9px 0 8px 0', background: '#444', color: '#fff' }}
                      onClick={() => setExpandedId(null)}
                    >Close</button>
                  </div>
                )}
              </li>
            );
          })}
          {filteredNews.length === 0 && (
            <li style={{
              color: darkMode ? CUSTOM_COLORS.secondary : '#333',
              textAlign: 'center', padding: 52
            }}>
              No articles found for selected categories.
            </li>
          )}
        </ul>
      )}
      {/* Placeholder UI: Info banner if this is API-powered */}
      {/* <div className="info-banner">Powered by News API (API integration coming soon!)</div> */}
    </div>
  );
}

// BOOKMARKED ARTICLES TAB
function BookmarkedArticles({ news, bookmarks, onSelect, setBookmarked, darkMode }) {
  const bookmarkedNews = news.filter(article => bookmarks.includes(article.id));
  return (
    <div className="container" style={{ paddingTop: 28 }}>
      <h2 style={{ fontWeight: 600, marginBottom: 32 }}>Bookmarked Articles</h2>
      {bookmarkedNews.length === 0 ? (
        <div style={{ color: darkMode ? '#aaa' : '#888', textAlign: 'center', marginTop: 64 }}>
          You haven't bookmarked any articles yet.
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookmarkedNews.map(article => (
            <li key={article.id} style={{
              background: darkMode ? '#23252b' : '#fff',
              borderRadius: 14,
              boxShadow: darkMode
                ? '0 2px 12px rgba(20,20,30,0.22)'
                : '0 1px 7px rgba(32,32,42,0.09)',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: 0
            }}
              onClick={() => onSelect(article.id)}
            >
              <img src={article.thumbnail}
                alt="Thumb"
                style={{
                  width: 62,
                  height: 62,
                  objectFit: 'cover',
                  borderTopLeftRadius: 14,
                  borderBottomLeftRadius: 14,
                }}
              />
              <div style={{ flex: 1, padding: 12 }}>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: 17,
                  color: darkMode ? '#fff' : '#060A1E',
                  fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {article.title}
                </h4>
                <div style={{ color: '#b7b5b9', fontSize: 13 }}>{article.source} • {article.time}</div>
              </div>
              <button
                className="btn"
                onClick={e => {
                  e.stopPropagation();
                  setBookmarked(prev => prev.filter(id => id !== article.id));
                }}
                style={{
                  background: CUSTOM_COLORS.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32, height: 32,
                  fontSize: 16,
                  marginRight: 16,
                }}
                aria-label="Remove Bookmark"
              >✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// BOTTOM NAVIGATION BAR
function BottomNavBar({ activeTab, setActiveTab, showSummarizer }) {
  return (
    <nav className="bottom-nav" style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 35,
      background: 'var(--kavia-dark)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '7px 0'
    }}>
      <NavTab
        icon="🏠"
        label="Home"
        active={activeTab === "home"}
        onClick={() => setActiveTab('home')}
      />
      <NavTab
        icon="🔖"
        label="Bookmarks"
        active={activeTab === "bookmarks"}
        onClick={() => setActiveTab('bookmarks')}
      />
      {showSummarizer && (
        <NavTab
          icon="📝"
          label="Summarize"
          active={activeTab === "summarizer"}
          onClick={() => setActiveTab('summarizer')}
        />
      )}
      <NavTab
        icon="⚙️"
        label="Settings"
        active={activeTab === "settings"}
        onClick={() => setActiveTab('settings')}
      />
    </nav>
  );
}
function NavTab({ icon, label, active, onClick }) {
  return (
    <button
      className="btn"
      style={{
        flex: 1,
        background: active ? '#212535' : 'transparent',
        color: active ? CUSTOM_COLORS.primary : '#aabbff',
        padding: '7px 0',
        borderRadius: 8,
        fontWeight: active ? 700 : 400,
        fontSize: 16,
        border: 'none',
        boxShadow: 'none',
        transition: 'background 0.15s'
      }}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      <span style={{ fontSize: 22, verticalAlign: 'middle', marginRight: 3 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// SETTINGS TAB (Placeholder UI for onboarding, notifications, etc.)
function SettingsScreen({ onShowPreferences, darkMode }) {
  return (
    <div className="container" style={{ paddingTop: 38 }}>
      <h2 style={{ fontWeight: 600, marginBottom: 18 }}>Settings</h2>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 380
      }}>
        <button className="btn" style={{ background: '#23294a', color: '#fff' }} onClick={onShowPreferences}>
          Personalize News Categories
        </button>
        {/* PUBLIC_INTERFACE: Notification toggle UI */}
        <div style={{
          background: '#23294a',
          borderRadius: 7,
          color: '#fff',
          padding: 15,
        }}>
          <b>Push Notifications</b>
          <div style={{ fontSize: 14, color: '#bbc' }}>
            {/* Placeholder: implement real notification permission checking/enabling */}
            Push notification support is coming soon!
          </div>
          <button className="btn" disabled style={{ marginTop: 7, background: CUSTOM_COLORS.accent }}>
            Enable Notifications (WIP)
          </button>
        </div>
      </div>
    </div>
  );
}

// PREFERENCES MODAL FOR CATEGORY SELECTION
function PreferencesModal({ selected, setSelected, onClose, allCategories }) {
  // Onboarding-style UI for category preferences
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(25,28,40,0.62)',
      zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#181a24',
        color: '#fff',
        borderRadius: 15,
        boxShadow: '0 4px 64px #08102290',
        maxWidth: 410,
        width: '96%',
        padding: 34,
        textAlign: 'center',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14,
          background: 'none', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer'
        }}>✕</button>
        <h2 style={{ fontWeight: 600, marginBottom: 9, fontSize: 23 }}>Your News Preferences</h2>
        <div style={{ color: '#fffc', fontSize: 15, marginBottom: 23 }}>
          Select your favorite news categories to personalize your NewsPulse feed.
        </div>
        <form>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 22
          }}>
            {allCategories.filter(c => c !== "All").map(cat => (
              <label key={cat} style={{
                display: 'inline-block',
                padding: '9px 16px',
                borderRadius: 17,
                background: selected.includes(cat) ? CUSTOM_COLORS.primary : '#242735',
                color: selected.includes(cat) ? '#fff' : '#bbb',
                fontWeight: selected.includes(cat) ? 700 : 500,
                cursor: 'pointer',
                fontSize: 15,
                minWidth: 80,
                margin: 2,
              }}>
                <input
                  type="checkbox"
                  checked={selected.includes(cat)}
                  onChange={() => {
                    const newSel = selected.includes(cat)
                      ? selected.filter(item => item !== cat)
                      : [...selected.filter(item => item !== "All"), cat];
                    setSelected(newSel.length === 0 ? ["All"] : newSel);
                  }}
                  style={{ display: 'none' }}
                />
                {cat}
              </label>
            ))}
          </div>
          <button
            className="btn"
            type="button"
            style={{ background: CUSTOM_COLORS.primary, color: '#fff', minWidth: 112, fontSize: 16, margin: '4px 0 0 0' }}
            onClick={onClose}
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
}

// --------------------
// README-STYLE COMMENTARY ON PLACEHOLDERS
// --------------------
/*
  // [AI Article Summarization]
  //  Placeholder UI for AI summary is present in ArticleDetail.
  //  Real implementation should invoke backend/AI API to fetch summary for a given article.
  //
  // [Push Notifications]
  //  Settings UI includes a placeholder to enable/disable notifications.
  //  In production, integrate with service worker + backend or push gateway.
  //
  // [Live News Feed]
  //  NewsFeed uses MOCK_NEWS; real implementation should call a News API or internal aggregator.
  //
  // [Onboarding/Preferences]
  //  PreferencesModal presents onboarding for category selection.
  //
  // Bookmarking, theme handling, and filtering are fully client-side with this scaffold.
  //
  // Code written for modularity: each section is easily extractable to separate files.
*/

export default App;
