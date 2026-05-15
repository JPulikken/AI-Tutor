import React from "react";

const quickActivities = [
  { name: "Colors", emoji: "🎨", section: "learning", color: "#FF7675" },
  { name: "Numbers", emoji: "🔢", section: "learning", color: "#74B9FF" },
  { name: "Letters", emoji: "🔤", section: "learning", color: "#A29BFE" },
  { name: "Chat", emoji: "💬", section: "chat", color: "#55EFC4" },
  { name: "Rewards", emoji: "⭐", section: "rewards", color: "#FFEAA7" },
  { name: "Progress", emoji: "📊", section: "dashboard", color: "#FD79A8" },
];

const features = [
  {
    title: "Chat with Tutor",
    emoji: "🤖",
    description: "Ask learning questions, talk about mood, or review progress.",
    section: "chat",
  },
  {
    title: "Learn Together",
    emoji: "📚",
    description: "Open short lessons for colors, numbers, letters, shapes, and social skills.",
    section: "learning",
  },
  {
    title: "Earn Rewards",
    emoji: "🏆",
    description: "Use stars from completed lessons to claim rewards.",
    section: "rewards",
  },
  {
    title: "See Progress",
    emoji: "📈",
    description: "Generate parent-friendly reports about lessons, accuracy, and emotions.",
    section: "dashboard",
  },
];

const Home = ({ onNavigate }) => {
  return (
    <div className="home">
      <header className="page-header">
        <h1 className="page-title">AI-Tutor Learning Space 👋</h1>
        <p className="page-subtitle">Personalized lessons, calm support, and progress tracking for children with Autism Spectrum Disorder.</p>
      </header>

      <section className="home-hero">
        <div>
          <h2>Ready for a personalized lesson?</h2>
          <p>Your tutor adapts practice by topic, level, progress, and emotional readiness.</p>
        </div>
        <div className="home-hero-actions">
          <button className="btn btn-large btn-primary" onClick={() => onNavigate("learning")}>
            Start Learning
          </button>
          <button className="btn btn-large btn-outline" onClick={() => onNavigate("chat")}>
            Chat with Tutor
          </button>
        </div>
      </section>

      <section className="home-section">
        <h2>Quick Activities 🎮</h2>
        <div className="home-quick-grid">
          {quickActivities.map((activity) => (
            <button
              key={activity.name}
              className="home-quick-card"
              style={{ borderColor: activity.color }}
              onClick={() => onNavigate(activity.section)}
            >
              <span>{activity.name} {activity.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>What You Can Do ✨</h2>
        <div className="home-feature-grid">
          {features.map((feature) => (
            <button
              key={feature.title}
              className="home-feature-card"
              onClick={() => onNavigate(feature.section)}
            >
              <strong>{feature.title} {feature.emoji}</strong>
              <span>{feature.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-tip">
        <h3>Daily Learning Tip 💡</h3>
        <p>Short, predictable practice works best. Pause, reset, and continue when the learner feels ready.</p>
      </section>
    </div>
  );
};

export default Home;
