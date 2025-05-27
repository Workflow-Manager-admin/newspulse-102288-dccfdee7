import React, { useState } from "react";

/**
 * CustomSummarizer Component
 * Allows user to paste any article/text, generate a summary, and view the AI-generated result.
 * Responsive, dark mode-ready, modular, with loading and error/feedback.
 *
 * Props:
 *  - darkMode: boolean (styles to suit theme)
 */

// PUBLIC_INTERFACE
function CustomSummarizer({ darkMode }) {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  // Mock AI summarize simulation
  const summarize = async (text) => {
    // Simulate API: short-circuit for very short input
    if (!text || text.trim().length < 16) {
      throw new Error("Please paste an article or paragraph with at least 16 characters.");
    }
    await new Promise((res) => setTimeout(res, 1100 + Math.random() * 900));
    // Fake summary for UX
    return (
      "Summary: " +
      text
        .split(/[.?!]/)
        .map(line => line.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(". ") +
      (text.length > 240 ? "..." : "")
    );
  };

  // PUBLIC_INTERFACE
  const handleSummarize = async (evt) => {
    evt.preventDefault();
    setTouched(true);
    setSummary("");
    setError("");
    setLoading(true);
    try {
      const result = await summarize(input);
      setSummary(result);
    } catch (e) {
      setError(e.message || "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  // Theme
  const cardBg = darkMode ? "#222839" : "#fff";
  const textCol = darkMode ? "#e2e9f7" : "#23233a";
  const boxShadow = darkMode ? "0 3px 10px #10172f8c" : "0 3px 19px #aabeff17";
  const outputBg = darkMode ? "#252b4b" : "#f2f3fe";
  const border = darkMode ? "1.5px solid #2a314d" : "1.5px solid #e9ecfa";
  const placeholderCol = darkMode ? "#bbb" : "#444";
  const textareaBg = darkMode ? "#1a1932" : "#f9faff";
  const accent = "#E87A41";

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "36px auto",
        background: cardBg,
        color: textCol,
        borderRadius: 14,
        boxShadow,
        padding: "32px 18px",
        border,
        transition: "all 0.15s",
        minHeight: 320,
      }}
      className="custom-summarizer"
    >
      <h2
        style={{
          fontWeight: 700,
          fontSize: 25,
          marginBottom: 7,
          textAlign: "center",
          color: darkMode ? "#fff" : "#191d3c"
        }}
      >
        Paste Your Own Article
      </h2>
      <div
        style={{
          color: "#F58E43",
          fontSize: 15,
          textAlign: "center",
          marginBottom: 18,
          fontWeight: 500,
        }}
      >
        Enter any text or article below, then click "Summarize This"
      </div>
      <form onSubmit={handleSummarize}>
        <textarea
          aria-label="Paste article or text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => setTouched(true)}
          style={{
            width: "100%",
            minHeight: 110,
            maxHeight: 270,
            resize: "vertical",
            fontSize: 16,
            borderRadius: 9,
            outline: "none",
            border: border,
            background: textareaBg,
            color: textCol,
            marginBottom: 8,
            padding: "14px 11px",
            fontFamily: "'Inter', 'Roboto', Arial, sans-serif"
          }}
          disabled={loading}
          placeholder="Paste or type your article, blog post, report, or any content here..."
          required
        />
        <div style={{ minHeight: 22, marginBottom: 7 }}>
          {touched && !input && (
            <span style={{ color: "#e96939", fontSize: 13 }}>
              Please paste or enter some text above.
            </span>
          )}
        </div>
        <button
          className="btn btn-large"
          style={{
            width: "100%",
            background: accent,
            color: "#fff",
            fontWeight: 600,
            fontSize: 17,
            padding: "12px 0",
            marginBottom: 8,
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.13s"
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize This"}
        </button>
      </form>
      <div
        style={{
          marginTop: 7,
          background: outputBg,
          color: darkMode ? "#fff" : "#202122",
          borderRadius: 8,
          minHeight: 52,
          padding: "14px 13px",
          fontSize: 16,
          boxShadow: darkMode
            ? "0 2px 9px #13173528"
            : "0 1px 6px #bccaf933",
          marginBottom: 8,
          transition: "background 0.18s"
        }}
      >
        {!loading && !summary && !error && (
          <span style={{ color: placeholderCol }}>
            {input.length > 12
              ? "Click Summarize to get a concise summary here."
              : "Paste content above to generate summary."}
          </span>
        )}
        {loading && (
          <span>
            <i>Summarizing…</i>
          </span>
        )}
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
      <div
        style={{
          color: darkMode ? "#ccc" : "#687298",
          fontSize: 12.5,
          textAlign: "center"
        }}
      >
        This feature does not store your input. Powered by simulated AI summarizer.
      </div>
    </div>
  );
}

export default CustomSummarizer;
