import React from 'react'

const Sidebar = ({ currentView, onNavigate, totalStars }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'learning', icon: '📚', label: 'Learn' },
    { id: 'rewards', icon: '⭐', label: 'Rewards' },
    { id: 'dashboard', icon: '📊', label: 'Progress' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🤖</div>
        <span className="sidebar-title">Autism Tutor</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="star-counter">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </aside>
  )
}

export default Sidebar

