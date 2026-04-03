import "./Landing.css";

const FEATURES = [
  {
    icon: "◐",
    title: "Mood Check-In",
    desc: "A quiet daily ritual. Track how you feel without judgment — just honest, gentle reflection.",
    page: "mood",
    color: "#5ba3c9",
  },
  {
    icon: "◎",
    title: "Anonymous Connect",
    desc: "Get matched with someone feeling something similar. One question. No names. Just presence.",
    page: "match",
    color: "#7ec8a4",
  },
  {
    icon: "◑",
    title: "Burnout Tracker",
    desc: "Spot the patterns before they spot you. Understand your energy so you can protect it.",
    page: "burnout",
    color: "#5ba3c9",
  },
  {
    icon: "◒",
    title: "Grief Journal",
    desc: "Loss doesn't follow a timeline. Write through it at your own pace, in your own words.",
    page: "grief",
    color: "#7ec8a4",
  },
];

export default function Landing({ onNavigate }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-badge">Mental health, reimagined</div>
        <h1 className="hero-title">
          You don't have to carry this
          <em> alone.</em>
        </h1>
        <p className="hero-sub">
          Tether is a quiet space for the feelings that are hard to name —
          social anxiety, burnout, grief, loneliness. No feeds. No followers.
          Just you, gently supported.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate("mood")}>
            Begin your check-in →
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate("match")}>
            Find someone like me
          </button>
        </div>
        <div className="hero-orbs">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
        </div>
      </section>

      <section className="features">
        <p className="features-label">What's inside</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <button
              key={f.page}
              className="feature-card"
              onClick={() => onNavigate(f.page)}
              style={{ "--accent-color": f.color }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <blockquote>
          "Most apps want your attention. Tether just wants you to be okay."
        </blockquote>
      </section>
    </div>
  );
}
