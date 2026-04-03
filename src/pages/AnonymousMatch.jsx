import { useState } from "react";
import "./AnonymousMatch.css";

const QUESTIONS = [
  "What's weighing on you most right now?",
  "What do you wish someone would ask you today?",
  "What's something you're quietly struggling with?",
  "What would feel like a win for you this week?",
  "What emotion have you been avoiding?",
];

const MOCK_MATCHES = [
  { id: 1, initials: "A", color: "#c4763a", response: "I've been carrying a lot of guilt about not being present enough for the people I love, while also feeling completely empty myself.", shared: ["Burnout", "Loneliness"] },
  { id: 2, initials: "B", color: "#7a9e7e", response: "Work has completely consumed me and I can't remember the last time I felt like a person and not just a role.", shared: ["Burnt out", "Overwhelmed"] },
  { id: 3, initials: "C", color: "#8b6fb5", response: "Grief has this way of sneaking up on me. I think I'm fine and then something small just breaks me open.", shared: ["Grieving", "Numb"] },
];

export default function AnonymousMatch() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [answer, setAnswer] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(null);

  const findMatches = () => {
    if (!answer.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setMatches(MOCK_MATCHES);
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="page">
      <h1 className="page-title">Anonymous Connect</h1>
      <p className="page-subtitle">Answer one question. Get matched with someone feeling something similar. No names, no profiles — just honest connection.</p>

      {step === 1 && (
        <div className="card match-card">
          <div className="question-selector">
            <label>Choose a question</label>
            <div className="questions-list">
              {QUESTIONS.map((q) => (
                <button
                  key={q}
                  className={`question-btn ${question === q ? "selected" : ""}`}
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Your answer</label>
            <p className="question-display">"{question}"</p>
            <textarea
              rows={4}
              placeholder="Be as honest as you want. This is shared anonymously..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          <div className="privacy-note">
            🔒 Your response is anonymous. No account needed. Nothing is stored permanently.
          </div>

          <button
            className="btn btn-green"
            onClick={findMatches}
            disabled={!answer.trim() || loading}
          >
            {loading ? "Finding matches..." : "Find someone like me →"}
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p>Looking for people who understand...</p>
        </div>
      )}

      {step === 2 && !connected && (
        <div className="matches-section">
          <p className="matches-intro">We found {matches.length} people who might understand. Choose one to connect with.</p>
          <div className="matches-list">
            {matches.map((m) => (
              <div key={m.id} className="match-card card">
                <div className="match-header">
                  <div className="match-avatar" style={{ background: m.color }}>
                    {m.initials}
                  </div>
                  <div>
                    <div className="match-name">Anonymous</div>
                    <div className="match-tags">
                      {m.shared.map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                </div>
                <p className="match-response">"{m.response}"</p>
                <button className="btn btn-green" onClick={() => setConnected(m)}>
                  Connect with this person →
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => { setStep(1); setAnswer(""); setMatches([]); }}>
            ← Try a different answer
          </button>
        </div>
      )}

      {connected && (
        <div className="card connected-card">
          <div className="connected-avatar" style={{ background: connected.color }}>
            {connected.initials}
          </div>
          <h2>You're connected ◎</h2>
          <p>You and this person are now in a private, anonymous conversation space. Be kind. Be honest. You're both here because you needed this.</p>
          <div className="chat-placeholder">
            <p className="chat-hint">💬 Chat feature coming soon — for now, take a moment to reflect on what you'd want to say to them.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => { setStep(1); setConnected(null); setAnswer(""); setMatches([]); }}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
