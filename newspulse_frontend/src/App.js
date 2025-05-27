import React, { useState, useEffect } from 'react';
import './App.css';

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

// --- MOCK DATA/PLACEHOLDERS (replace with API responses):
const CATEGORIES = ['All', 'Technology', 'Politics', 'Health', 'Sports', 'Entertainment'];
const MOCK_NEWS = [
  {
    id: '1',
    title: "AI Transforms the News Industry",
    source: "TechCrunch",
    time: "5m ago",
    thumbnail: "https://placehold.co/80x80/1A73E8/FFFFFF?text=AI",
    content: "Full article text goes here. Lorem ipsum dolor sit amet...",
    summary: "A brief AI summary would be placed here.",
  },
  {
    id: '2',
    title: "Elections 2024: Major Updates",
    source: "BBC",
    time: "10m ago",
    thumbnail: "https://placehold.co/80x80/FF5252/FFFFFF?text=Vote",
    content: "Full article text goes here. Lorem ipsum dolor sit amet...",
    summary: "A brief AI summary would be placed here.",
  },
  // Add more mock headlines...
];

// ---- MAIN APP START ----

// PUBLIC_INTERFACE
function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [newsFeed, setNewsFeed] = useState([]); // Would be loaded from API
  const [bookmarked, setBookmarked] = useState(() => {
    // Try to restore bookmarks from localStorage
    const saved = localStorage.getItem('bookmarkedNews');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('home'); // "home" | "bookmarks" | "settings"

  // On first mount: load news (placeholder: use mock data)
  useEffect(() => {
    // TODO: Replace with API call to News API
    setNewsFeed(MOCK_NEWS);
  }, []);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('bookmarkedNews', JSON.stringify(bookmarked));
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
            news={newsFeed}
            selectedCategories={selectedCategories}
            onSelect={setSelectedNewsId}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'home' && selectedNewsId && (
          <ArticleDetail
            article={newsFeed.find(n => n.id === selectedNewsId)}
            onBack={() => setSelectedNewsId(null)}
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            // AI summary UI placeholder within component
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarkedArticles
            news={newsFeed}
            bookmarks={bookmarked}
            onSelect={setSelectedNewsId}
            setBookmarked={setBookmarked}
            darkMode={darkMode}
          />
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
function NewsFeed({ news, selectedCategories, onSelect, bookmarked, setBookmarked, darkMode }) {
  // Filter by selected categories (stub logic: filters by presence in title)
  const filteredNews = selectedCategories.includes('All')
    ? news
    : news.filter(article =>
        selectedCategories.some(cat =>
          article.title.toLowerCase().includes(cat.toLowerCase())
        )
      );

  return (
    <div className="container">
      <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0' }}>
        {/* TODO: Add "loading" spinner when integrating real API */}
        {filteredNews.map(article => (
          <li key={article.id} style={{
            marginBottom: 24,
            background: darkMode ? '#23252b' : '#fff',
            borderRadius: 14,
            boxShadow: darkMode
              ? '0 2px 12px rgba(20,20,30,0.25)'
              : '0 1px 7px rgba(32,32,42,0.09)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: 0,
            border: '1px solid #25293608'
          }}
            onClick={() => onSelect(article.id)}
          >
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
                marginRight: 17,
                cursor: 'pointer',
              }}
              aria-label={bookmarked.includes(article.id) ? "Remove Bookmark" : "Add Bookmark"}
            >{bookmarked.includes(article.id) ? '★' : '☆'}</button>
          </li>
        ))}
        {filteredNews.length === 0 && (
          <li style={{
            color: darkMode ? CUSTOM_COLORS.secondary : '#333',
            textAlign: 'center', padding: 52
          }}>
            No articles found for selected categories.
          </li>
        )}
      </ul>
      {/* Placeholder UI: Info banner if this is API-powered */}
      {/* <div className="info-banner">Powered by News API (API integration coming soon!)</div> */}
    </div>
  );
}

// ARTICLE DETAIL (+ AI SUMMARY UI placeholder)
function ArticleDetail({ article, onBack, bookmarked, setBookmarked }) {
  if (!article) return <div className="container">Article not found.</div>;
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <button className="btn" onClick={onBack} style={{ marginBottom: 22 }}>← Back</button>
      <h2 style={{ fontWeight: 700, fontSize: 26 }}>{article.title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 14 }}>
        <span>{article.source}</span>
        <span>{article.time}</span>
        <button
          className="btn"
          aria-label={bookmarked.includes(article.id) ? "Remove Bookmark" : "Add Bookmark"}
          onClick={() => {
            setBookmarked(prev => prev.includes(article.id)
              ? prev.filter(id => id !== article.id)
              : [...prev, article.id]);
          }}
          style={{
            background: bookmarked.includes(article.id) ? CUSTOM_COLORS.accent : CUSTOM_COLORS.primary,
            color: '#fff',
            marginLeft: 18,
            borderRadius: 8,
          }}>
          {bookmarked.includes(article.id) ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>
      <img src={article.thumbnail} alt="Thumbnail" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 9, marginBottom: 18 }} />
      <div style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 28, color: '#ccc' }}>
        {article.content}
      </div>

      {/* AI SUMMARY (UI placeholder, real integration should fetch summary from backend/AI) */}
      <div style={{
        background: '#24293f',
        borderRadius: 8,
        boxShadow: '0 1px 7px rgba(32,32,60,0.10)',
        padding: 18,
        marginBottom: 16,
        color: '#e2e9f7',
      }}>
        <b>AI Summary</b>
        <div style={{ marginTop: 9 }}>
          {/* Placeholder for AI-generated summary */}
          <i style={{ color: '#FF5252' }}>[AI summary coming soon]</i>
          <div>{article.summary}</div>
        </div>
      </div>
      {/* Additional actions: share, save, etc. could be added here */}
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
function BottomNavBar({ activeTab, setActiveTab }) {
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
