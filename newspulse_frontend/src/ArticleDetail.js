import React, { useState } from "react";

/**
 * ArticleDetail Component
 * Shows full article, enables summarization via simulated AI API.
 * Responsive, dark mode-aware, handles loading, error, and result states.
 *
 * Props:
 *  - article: object { id, title, source, time, thumbnail, content }
 *  - onBack: function to go back to main feed
 *  - bookmarked: array of bookmarked article ids
 *  - setBookmarked: fn to update bookmarks
 *  - darkMode: boolean (optional, for future extensibility)
 */

// PUBLIC_INTERFACE
function ArticleDetail({ article, onBack, bookmarked, setBookmarked, darkMode }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simulated AI API call with delay and possible error
  const fetchSummary = () => {
    setLoading(true);
    setSummary("");
    setError("");
    // Simulate network delay and random error
    setTimeout(() => {
      if (Math.random() < 0.13) {
        setError("Failed to generate summary. Please try again.");
        setSummary("");
      } else {
        setSummary(
          "AI Summary: " +
            (article.content
              ? `${article.content.slice(0, 60)}... [summary simulated]`
              : "No content available.")
        );
      }
      setLoading(false);
    }, 1100 + Math.random() * 700);
  };

  if (!article)
    return (
      <div className="container" style={{ color: "#e22", marginTop: 54 }}>
        Article not found.
        <button className="btn" onClick={onBack} style={{ marginLeft: 18 }}>
          ← Back
        </button>
      </div>
    );

  // Responsive and dark mode styling
  const isBookmarked = bookmarked && bookmarked.includes(article.id);
  const cardBg = darkMode === false ? "#fff" : "#24293f";
  const summaryBg = darkMode === false ? "#e5e7f7" : "#282c45";
  const summaryText = darkMode === false ? "#1a1b29" : "#cee7ff";

  return (
    <div className="container" style={{ maxWidth: 730, paddingTop: 36, paddingBottom: 32 }}>
      <button className="btn" onClick={onBack} style={{ marginBottom: 22 }}>
        ← Back
      </button>
      <div
        style={{
          background: cardBg,
          borderRadius: 14,
          boxShadow: darkMode === false
            ? "0 2px 15px #5260df09"
            : "0 2px 14px #05090c31",
          padding: 24,
          marginBottom: 22
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 5, color: darkMode === false ? "#13153c" : "#fff" }}>
          {article.title}
        </h2>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", color: "#9bb", fontSize: 14, marginBottom: 8
        }}>
          <span>{article.source}</span>
          <span>{article.time}</span>
          <button
            className="btn"
            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            onClick={() =>
              setBookmarked(prev =>
                isBookmarked ? prev.filter(id => id !== article.id) : [...prev, article.id]
              )
            }
            style={{
              background: isBookmarked ? "#FF5252" : "#1A73E8",
              color: "#fff",
              marginLeft: 14,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15
            }}
          >
            {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>
        <img
          src={article.thumbnail}
          alt="Thumbnail"
          style={{
            width: "100%", maxHeight: 320, objectFit: "cover",
            borderRadius: 9, marginBottom: 18, marginTop: 2
          }}
        />
        <div style={{
          fontSize: 17, lineHeight: 1.6, marginBottom: 24,
          color: darkMode === false ? "#383b5d" : "#cbe2fc"
        }}>
          {article.content}
        </div>

        {/* Summarize Button */}
        <button
          className="btn btn-large"
          onClick={fetchSummary}
          disabled={loading}
          style={{
            background: "#E87A41",
            color: "#fff",
            fontWeight: 600,
            fontSize: 17,
            marginBottom: 14
          }}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>

        {/* Summary/error/result block */}
        <div
          style={{
            marginTop: 7,
            background: summaryBg,
            color: summaryText,
            borderRadius: 8,
            minHeight: 52,
            padding: "13px 15px",
            fontSize: 16,
            transition: "background 0.18s"
          }}
        >
          {!loading && !summary && !error && (
            <span style={{ color: "#c9c9cc" }}>
              ← Click "Summarize" to generate a concise AI summary here.
            </span>
          )}
          {loading && <span><i>Generating summary&hellip;</i></span>}
          {error && (
            <span style={{ color: "#e33934", fontWeight: 500 }}>
              {error}
            </span>
          )}
          {!loading && summary && (
            <div>
              <b>{summary}</b>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;

