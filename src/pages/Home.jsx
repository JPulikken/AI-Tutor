import React from 'react'

const Home = ({ onStartLearning }) => {
  const features = [
    {
      icon: '💬',
      title: 'Chat with AI',
      description: 'Talk to your friendly AI tutor who is always ready to help'
    },
    {
      icon: '📚',
      title: 'Learn Together',
      description: 'Fun lessons designed just for you with pictures and games'
    },
    {
      icon: '⭐',
      title: 'Earn Stars',
      description: 'Get stars for completing lessons and unlock cool rewards'
    },
    {
      icon: '📊',
      title: 'See Progress',
      description: 'Watch how much you are learning every day'
    }
  ]

  const quickActivities = [
    { icon: '🎨', name: 'Colors', color: '#FF7675' },
    { icon: '🔢', name: 'Numbers', color: '#74B9FF' },
    { icon: '🔤', name: 'Letters', color: '#A29BFE' },
    { icon: '🧩', name: 'Puzzles', color: '#55EFC4' },
    { icon: '🎵', name: 'Music', color: '#FFEAA7' },
    { icon: '🌈', name: 'Shapes', color: '#FD79A8' }
  ]

  return (
    <div className="home">
      <header className="page-header">
        <h1 className="page-title">👋 Hello, Friend!</h1>
        <p className="page-subtitle">What would you like to do today?</p>
      </header>

      {/* Quick Activities */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎮 Quick Activities
        </h2>
        <div className="grid grid-6" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px'
        }}>
          {quickActivities.map((activity, index) => (
            <div
              key={index}
              className="card card-clickable"
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                border: `3px solid ${activity.color}`,
                transition: 'transform 0.2s ease'
              }}
              onClick={onStartLearning}
            >
              <div style={{ 
                fontSize: '40px', 
                marginBottom: '8px',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {activity.icon}
              </div>
              <span style={{ 
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {activity.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #5B9BD5 0%, #9575CD 100%)',
        color: 'white',
        marginBottom: '32px',
        textAlign: 'center',
        padding: '40px'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>
          🌟 Welcome to Autism Tutor! 🌟
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: '20px' }}>
          Your friendly learning companion is here to help you learn and have fun!
        </p>
        <button 
          className="btn btn-large"
          style={{
            background: 'white',
            color: '#5B9BD5',
            fontWeight: '700'
          }}
          onClick={onStartLearning}
        >
          🚀 Start Learning Now!
        </button>
      </div>

      {/* Features */}
      <section>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✨ What You Can Do
        </h2>
        <div className="grid grid-2" style={{ display: 'grid', gap: '16px' }}>
          {features.map((feature, index) => (
            <div key={index} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ 
                fontSize: '40px',
                background: '#E3F2FD',
                padding: '12px',
                borderRadius: '12px'
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '600' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#5D6D7E', fontSize: '14px' }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Tip */}
      <div className="card" style={{
        marginTop: '32px',
        background: '#FFF8E1',
        border: '2px solid #FFE082'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>💡</span>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              Daily Learning Tip
            </h3>
            <p style={{ color: '#5D6D7E', fontSize: '14px' }}>
              Take your time learning new things. It's okay to ask for help when you need it!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

