import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import MoodCheckIn from "./pages/MoodCheckIn";
import AnonymousMatch from "./pages/AnonymousMatch";
import BurnoutTracker from "./pages/BurnoutTracker";
import GriefJournal from "./pages/GriefJournal";
import "./App.css";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "mood", label: "Mood" },
  { id: "match", label: "Connect" },
  { id: "burnout", label: "Burnout" },
  { id: "grief", label: "Journal" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Restore session on page refresh
  useEffect(() => {
    const token = localStorage.getItem("tether-token");
    const savedUser = localStorage.getItem("tether-user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("tether-user", JSON.stringify(userData));
    setUser(userData);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("tether-token");
    localStorage.removeItem("tether-user");
    setUser(null);
    setPage("home");
    setMenuOpen(false);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <div className="app">
      <nav className="nav">
        <button className="nav-logo" onClick={() => setPage("home")}>◎ Tether</button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {NAV_ITEMS.slice(1).map((item) => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? "active" : ""}`}
              onClick={() => { setPage(item.id); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user.name}</span>
          </div>
          <button className="btn btn-secondary nav-signout" onClick={handleLogout}>Sign out</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>
      <main className="main">
        {page === "home" && <Landing onNavigate={setPage} user={user} />}
        {page === "mood" && <MoodCheckIn userId={user.userId} />}
        {page === "match" && <AnonymousMatch />}
        {page === "burnout" && <BurnoutTracker userId={user.userId} />}
        {page === "grief" && <GriefJournal userId={user.userId} />}
      </main>
    </div>
  );
}
