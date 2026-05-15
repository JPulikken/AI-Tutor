import React from "react";

const navItems = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "learning", icon: "📚", label: "Learn" },
  { id: "rewards", icon: "⭐", label: "Rewards" },
  { id: "dashboard", icon: "📊", label: "Progress" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

const Sidebar = ({ currentView, onNavigate, totalStars, user, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" aria-hidden="true">
          🧠
        </div>
        <span className="sidebar-title">AI-Tutor</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => event.key === "Enter" && onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="nav-text">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="star-counter">
        <span>⭐ Stars</span>
        <span>{totalStars}</span>
      </div>

      <div className="sidebar-user">
        <span className="sidebar-user-name">{user?.name}</span>
        <button type="button" onClick={onLogout}>
          Logout 👋
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
