import { useState, useEffect } from "react";
import { saveBurnout, getBurnoutHistory } from "../api";
import "./BurnoutTracker.css";

const DIMENSIONS = [
  { id: "energy", label: "Energy", icon: "⚡", question: "How's your physical energy today?" },
  { id: "motivation", label: "Motivation", icon: "🎯", question: "How motivated do you feel about your work?" },
  { id: "emotional", label: "Emotional Reserve", icon: "💧", question: "How emotionally available do you feel?" },
  { id: "clarity", label: "Mental Clarity", icon: "🧠", question: "How clear and focused is your mind?" },
  { id: "connection", label: "Connection", icon: "🤝", question: "How connected do you feel to others?" },
];

function getBurnoutLevel(avg) {
  if (avg >= 4) return { label: "Thriving", color: "#7ec8a4", desc: "You're in a good place. Keep protecting what's working." };
  if (avg >= 3) return { label: "Coping", color: "#5ba3c9", desc: "You're managing, but watch for warning signs." };
  if (avg >= 2) return { label: "Struggling", color: "#e09060", desc: "Some signs of burnout. Consider what you can reduce or ask for help with." };
  return { label: "Burnt Out", color: "#c07070", desc: "Please be gentle with yourself. You need rest and support." };
}

export default function BurnoutTracker() {
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    const data = await getBurnoutHistory();
    if (Array.isArray(data)) setHistory(data);
  };

  const setScore = (id, val) => setScores((prev) => ({ ...prev, [id]: val }));
  const allAnswered = DIMENSIONS.every((d) => scores[d.id] !== undefined);
  const avg = allAnswered ? Object.values(scores).reduce((a, b) => a + b, 0) / DIMENSIONS.length : null;
  const level = avg !== null ? getBurnoutLevel(avg) : null;

  const submit = async () => {
    setLoading(true);
    await saveBurnout({ scores, average: avg, level: level.label });
    await fetchHistory();
    setLoading(false);
    setSubmitted(true);
  };

  const reset = () => { setScores({}); setSubmitted(false); };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="page">
      <h1 className="page-title">Burnout Tracker</h1>
      <p className="page-subtitle">Rate yourself honestly across 5 dimensions. No judgment — just clarity.</p>

      {!submitted ? (
        <div className="burnout-form">
          {DIMENSIONS.map((d) => (
            <div key={d.id} className="card dimension-card">
              <div className="dimension-header">
                <span className="dimension-icon">{d.icon}</span>
                <div>
                  <div className="dimension-label">{d.label}</div>
                  <div className="dimension-question">{d.question}</div>
                </div>
              </div>
              <div className="score-buttons">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button key={v} className={`score-btn ${scores[d.id] === v ? "selected" : ""}`} onClick={() => setScore(d.id, v)}>{v}</button>
                ))}
              </div>
              <div className="score-labels"><span>Very low</span><span>Very high</span></div>
              {scores[d.id] && <div className="score-bar"><div className="score-fill" style={{ width: `${(scores[d.id] / 5) * 100}%` }} /></div>}
            </div>
          ))}
          <button className="btn btn-primary" disabled={!allAnswered || loading} onClick={submit}>
            {loading ? "Saving..." : "See my results →"}
          </button>
        </div>
      ) : (
        <div className="results-section">
          <div className="card result-card" style={{ "--level-color": level.color }}>
            <div className="result-badge" style={{ background: level.color }}>{level.label}</div>
            <div className="result-score">{avg.toFixed(1)} / 5</div>
            <p className="result-desc">{level.desc}</p>
          </div>
          <div className="breakdown-title">Breakdown</div>
          <div className="breakdown-list">
            {DIMENSIONS.map((d) => (
              <div key={d.id} className="card breakdown-item">
                <div className="breakdown-header">
                  <span>{d.icon} {d.label}</span>
                  <span className="breakdown-score">{scores[d.id]}/5</span>
                </div>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${(scores[d.id] / 5) * 100}%`, background: scores[d.id] <= 2 ? "#c07070" : scores[d.id] === 3 ? "#5ba3c9" : "#7ec8a4" }} />
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={reset}>← Track again</button>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section" style={{ marginTop: "2.5rem" }}>
          <h3 className="history-title" style={{ fontFamily: "Lora, serif", fontSize: "1.2rem", marginBottom: "1rem" }}>Past assessments</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {history.map((h, i) => (
              <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#4a6878" }}>{formatDate(h.createdAt)}</span>
                <span className="result-badge" style={{ background: getBurnoutLevel(h.average).color, padding: "0.25rem 0.75rem", borderRadius: "2rem", color: "white", fontSize: "0.8rem" }}>{h.level}</span>
                <span style={{ fontWeight: 600 }}>{Number(h.average).toFixed(1)} / 5</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
