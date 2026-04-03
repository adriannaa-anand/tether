import { useState, useEffect } from "react";
import { saveJournalEntry, getJournalEntries, deleteJournalEntry } from "../api";
import "./GriefJournal.css";

const PROMPTS = [
  "What do you miss most today?",
  "Write about a memory that makes you smile and ache at the same time.",
  "What would you say if you had one more conversation?",
  "How has this loss changed you?",
  "What are you still learning to live without?",
  "What do you wish people understood about your grief?",
  "Write about a moment when grief surprised you recently.",
];

const MOOD_COLORS = {
  tender: "#89b8d4",
  reflective: "#7ec8a4",
  heavy: "#8b9bb4",
  grateful: "#5ba3c9",
};

export default function GriefJournal() {
  const [entries, setEntries] = useState([]);
  const [writing, setWriting] = useState(false);
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("reflective");
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    const data = await getJournalEntries();
    if (Array.isArray(data)) setEntries(data);
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await saveJournalEntry({ prompt, content, mood });
    await fetchEntries();
    setContent("");
    setWriting(false);
    setLoading(false);
  };

  const handleDelete = async (createdAt) => {
    await deleteJournalEntry(createdAt);
    setViewing(null);
    await fetchEntries();
  };

  const randomPrompt = () => {
    const others = PROMPTS.filter((p) => p !== prompt);
    setPrompt(others[Math.floor(Math.random() * others.length)]);
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  if (viewing) {
    return (
      <div className="page">
        <button className="btn btn-secondary back-btn" onClick={() => setViewing(null)}>← Back to journal</button>
        <div className="card entry-view">
          <div className="entry-view-date">{formatDate(viewing.createdAt)}</div>
          <div className="entry-view-prompt">"{viewing.prompt}"</div>
          <p className="entry-view-content">{viewing.content}</p>
          <div className="entry-view-footer">
            <span className="mood-badge" style={{ background: MOOD_COLORS[viewing.mood] }}>{viewing.mood}</span>
            <button className="btn btn-secondary delete-btn" onClick={() => handleDelete(viewing.createdAt)}>Delete</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Grief Journal</h1>
      <p className="page-subtitle">Loss doesn't follow a timeline. Write at your own pace, in your own words.</p>

      {!writing ? (
        <>
          <button className="btn btn-purple new-entry-btn" onClick={() => setWriting(true)}>+ New entry</button>
          {entries.length === 0 ? (
            <div className="empty-state card"><p>Your journal is empty. When you're ready, write your first entry.</p></div>
          ) : (
            <div className="entries-list">
              {entries.map((entry, i) => (
                <button key={i} className="card entry-card" onClick={() => setViewing(entry)}>
                  <div className="entry-header">
                    <span className="entry-date">{formatDate(entry.createdAt)}</span>
                    <span className="mood-badge" style={{ background: MOOD_COLORS[entry.mood] }}>{entry.mood}</span>
                  </div>
                  <div className="entry-prompt">"{entry.prompt}"</div>
                  <p className="entry-preview">{entry.content}</p>
                  <span className="entry-read">Read more →</span>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="card writing-card">
          <div className="prompt-section">
            <label>Today's prompt</label>
            <p className="current-prompt">"{prompt}"</p>
            <button className="btn btn-secondary prompt-shuffle" onClick={randomPrompt}>Try a different prompt ↻</button>
          </div>
          <div>
            <label>Your entry</label>
            <textarea rows={8} placeholder="Write as much or as little as you need..." value={content} onChange={(e) => setContent(e.target.value)} autoFocus />
          </div>
          <div className="mood-section">
            <label>How does this entry feel?</label>
            <div className="mood-options">
              {Object.entries(MOOD_COLORS).map(([m, c]) => (
                <button key={m} className={`mood-option ${mood === m ? "selected" : ""}`} style={{ "--mood-c": c }} onClick={() => setMood(m)}>{m}</button>
              ))}
            </div>
          </div>
          <div className="writing-actions">
            <button className="btn btn-secondary" onClick={() => { setWriting(false); setContent(""); }}>Cancel</button>
            <button className="btn btn-purple" onClick={saveEntry} disabled={!content.trim() || loading}>{loading ? "Saving..." : "Save entry"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
