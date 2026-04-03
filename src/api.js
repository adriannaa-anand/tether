const BASE = "http://18.188.204.202:8080/api";

const getToken = () => localStorage.getItem("tether-token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// AUTH
export const registerUser = (data) =>
  fetch(`${BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json());

export const loginUser = (data) =>
  fetch(`${BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json());

// MOODS
export const saveMood = (data) =>
  fetch(`${BASE}/moods`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json());

export const getMoods = () =>
  fetch(`${BASE}/moods`, { headers: headers() }).then((r) => r.json());

// JOURNAL
export const saveJournalEntry = (data) =>
  fetch(`${BASE}/journal`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json());

export const getJournalEntries = () =>
  fetch(`${BASE}/journal`, { headers: headers() }).then((r) => r.json());

export const deleteJournalEntry = (createdAt) =>
  fetch(`${BASE}/journal/${encodeURIComponent(createdAt)}`, { method: "DELETE", headers: headers() }).then((r) => r.json());

// BURNOUT
export const saveBurnout = (data) =>
  fetch(`${BASE}/burnout`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json());

export const getBurnoutHistory = () =>
  fetch(`${BASE}/burnout`, { headers: headers() }).then((r) => r.json());
