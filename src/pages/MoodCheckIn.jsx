import { useState, useEffect } from "react";
import { saveMood, getMoods } from "../api";
import "./MoodCheckIn.css";

const MOODS = [
  { emoji: "😔", label: "Low", value: 1, color: "#8b9bb4" },
  { emoji: "😕", label: "Meh", value: 2, color: "#a0a0a0" },
  { emoji: "😐", label: "Okay", value: 3, color: "#5ba3c9" },
  { emoji: "🙂", label: "Good", value: 4, color: "#7ec8a4" },
  { emoji: "😊", label: "Great", value: 5, color: "#3d8aaf" },
];

const FEELINGS = [
  "Anxious", "Lonely", "Burnt out", "Grieving", "Numb",
  "Hopeful", "Calm", "Overwhelmed", "Disconnected", "Present",
  "Tired", "Grateful", "Frustrated", "Peaceful", "Confused",
];

export default function MoodCheckIn() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState(null);
  const [feelings, setFeelings] = useState([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    const data = await getMoods();
    if (Array.isArray(data)) setHistory(data);
  };

  const toggleFeeling = (f) =>
    setFeelings((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const submit = async () => {
    setLoading(true);
    await saveMood({ mood, feelings, note });
    await fetchHistory();
    setLoading(false);
    setStep(3);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="page">
      <h1 className="page-title">Mood Check-In</h1>
      <p className="page-subtitle">A moment of honest reflection. No right or wrong answers.</p>

      {step === 1 && (
        <div className="card mood-step">
          <p className="step-label">Step 1 of 2 — How are you feeling right now?</p>
          <div className="mood-grid">
            {MOODS.map((m) => (
              <button key={m.value} className={`mood-btn ${mood?.value === m.value ? "selected" : ""}`} style={{ "--mood-color": m.color }} onClick={() => setMood(m)}>
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          <div className="feelings-section">
            <label>Any of these resonate?</label>
            <div className="feelings-grid">
              {FEELINGS.map((f) => (
                <button key={f} className={`feeling-tag ${feelings.includes(f) ? "selected" : ""}`} onClick={() => toggleFeeling(f)}>{f}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => mood && setStep(2)} disabled={!mood}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div className="card mood-step">
          <p className="step-label">Step 2 of 2 — Want to say anything about it?</p>
          <div className="selected-mood-preview" style={{ "--mood-color": mood.color }}>
            <span>{mood.emoji}</span><span>{mood.label}</span>
            {feelings.length > 0 && (
              <div className="preview-feelings">{feelings.map((f) => <span key={f} className="tag">{f}</span>)}</div>
            )}
          </div>
          <textarea rows={5} placeholder="What's on your mind? This is just for you..." value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="step-actions">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Saving..." : "Save check-in ✓"}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card mood-step success-step">
          <div className="success-icon">✓</div>
          <h2>Check-in saved</h2>
          <p>You showed up for yourself today. That matters.</p>
          <button className="btn btn-secondary" onClick={() => { setStep(1); setMood(null); setFeelings([]); setNote(""); }}>New check-in</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3 className="history-title">Recent check-ins</h3>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <div className="history-meta">
                  <span className="history-emoji">{MOODS.find((m) => m.value === h.mood?.value)?.emoji || "😐"}</span>
                  <div>
                    <div className="history-date">{formatDate(h.createdAt)}</div>
                    <div className="history-mood">{h.mood?.label || "—"}</div>
                  </div>
                </div>
                <div className="history-feelings">
                  {(h.feelings || []).map((f) => <span key={f} className="tag">{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
