import React, { useState } from 'react'

const Dashboard = ({ userProgress }) => {
  const [selectedChild, setSelectedChild] = useState('child1')
  const [dateRange, setDateRange] = useState('week')

  const children = [
    { id: 'child1', name: 'Alex', avatar: '👦', age: 8 },
    { id: 'child2', name: 'Emma', avatar: '👧', age: 6 }
  ]

  const recentActivity = [
    { 
      type: 'lesson', 
      title: 'Completed "Learn Colors" lesson', 
      time: 'Today, 2:30 PM', 
      stars: 5,
      icon: '🌈'
    },
    { 
      type: 'chat', 
      title: 'Asked about animals', 
      time: 'Today, 1:15 PM', 
      stars: 0,
      icon: '💬'
    },
    { 
      type: 'lesson', 
      title: 'Completed "Counting 1-10" lesson', 
      time: 'Yesterday, 4:00 PM', 
      stars: 10,
      icon: '🔢'
    },
    { 
      type: 'reward', 
      title: 'Redeemed "Screen Time" reward', 
      time: 'Yesterday, 3:30 PM', 
      stars: -15,
      icon: '📺'
    },
    { 
      type: 'lesson', 
      title: 'Completed "ABC Letters" lesson', 
      time: '2 days ago', 
      stars: 10,
      icon: '🔤'
    }
  ]

  const weeklyStats = [
    { day: 'Mon', lessons: 2, minutes: 25 },
    { day: 'Tue', lessons: 1, minutes: 15 },
    { day: 'Wed', lessons: 3, minutes: 40 },
    { day: 'Thu', lessons: 2, minutes: 30 },
    { day: 'Fri', lessons: 1, minutes: 20 },
    { day: 'Sat', lessons: 0, minutes: 0 },
    { day: 'Sun', lessons: 0, minutes: 0 }
  ]

  const skillProgress = [
    { skill: 'Colors', progress: 75, color: '#FF6B6B' },
    { skill: 'Numbers', progress: 60, color: '#4ECDC4' },
    { skill: 'Letters', progress: 45, color: '#A29BFE' },
    { skill: 'Shapes', progress: 80, color: '#FFE66D' },
    { skill: 'Emotions', progress: 55, color: '#F48FB1' },
    { skill: 'Social Skills', progress: 30, color: '#81ECEC' }
  ]

  const maxMinutes = Math.max(...weeklyStats.map(d => d.minutes), 1)

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1 className="page-title">📊 Parent/Teacher Dashboard</h1>
        <p className="page-subtitle">Track learning progress and activity</p>
      </header>

      {/* Child Selector */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>👤</span>
            <select 
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #E8EEF2',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.avatar} {child.name} (Age {child.age})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📅</span>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid #E8EEF2',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{userProgress.totalStars}</div>
          <div className="stat-label">Total Stars Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{userProgress.completedLessons.length}</div>
          <div className="stat-label">Lessons Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{userProgress.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">2.5h</div>
          <div className="stat-label">Learning Time This Week</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Weekly Activity Chart */}
        <div className="card">
          <h3 style={{ 
            fontSize: '18px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📈 Weekly Activity
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
            {weeklyStats.map((day, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                <div 
                  style={{
                    height: `${(day.minutes / maxMinutes) * 120}px`,
                    background: day.minutes > 0 ? 'linear-gradient(180deg, #5B9BD5 0%, #3D7AB8 100%)' : '#E8EEF2',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '8px',
                    transition: 'height 0.3s ease',
                    minHeight: '4px'
                  }}
                  title={`${day.minutes} minutes`}
                />
                <span style={{ fontSize: '12px', color: '#5D6D7E' }}>{day.day}</span>
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '12px',
            fontSize: '12px',
            color: '#8E99A4'
          }}>
            <span>Total: {weeklyStats.reduce((a, b) => a + b.minutes, 0)} minutes</span>
            <span>Lessons: {weeklyStats.reduce((a, b) => a + b.lessons, 0)}</span>
          </div>
        </div>

        {/* Skill Progress */}
        <div className="card">
          <h3 style={{ 
            fontSize: '18px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 Skill Progress
          </h3>
          {skillProgress.map((skill, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{ fontWeight: '500' }}>{skill.skill}</span>
                <span style={{ color: '#5D6D7E', fontSize: '14px' }}>{skill.progress}%</span>
              </div>
              <div className="progress-bar" style={{ height: '10px' }}>
                <div 
                  style={{
                    width: `${skill.progress}%`,
                    height: '100%',
                    background: skill.color,
                    borderRadius: '10px',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ 
          fontSize: '18px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🕐 Recent Activity
        </h3>
        <div>
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div 
                className="activity-icon"
                style={{
                  background: activity.type === 'lesson' ? '#E3F2FD' :
                             activity.type === 'chat' ? '#E8F5E9' : '#FFF8E1'
                }}
              >
                {activity.icon}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
              {activity.stars > 0 && (
                <span style={{ 
                  background: '#FFF8E1',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: '#F57F17',
                  fontSize: '14px'
                }}>
                  +{activity.stars} ⭐
                </span>
              )}
              {activity.stars < 0 && (
                <span style={{ 
                  background: '#FFEBEE',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: '#EF5350',
                  fontSize: '14px'
                }}>
                  {activity.stars} ⭐
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card" style={{ marginTop: '24px', background: '#E8F5E9' }}>
        <h3 style={{ 
          fontSize: '18px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💡 Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <div>
              <strong>Focus on Social Skills</strong>
              <p style={{ fontSize: '14px', color: '#5D6D7E', marginTop: '4px' }}>
                Only 30% progress in social skills. Consider doing the "Saying Hello" lesson together.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <div>
              <strong>Build the Streak</strong>
              <p style={{ fontSize: '14px', color: '#5D6D7E', marginTop: '4px' }}>
                Learning every day helps build habits. Try 10 minutes of learning today!
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🌟</span>
            <div>
              <strong>Celebrate Progress</strong>
              <p style={{ fontSize: '14px', color: '#5D6D7E', marginTop: '4px' }}>
                Great job on colors and shapes! Consider using these strengths to build confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginTop: '24px',
        justifyContent: 'center'
      }}>
        <button className="btn btn-outline">
          📄 Download Report
        </button>
        <button className="btn btn-outline">
          📧 Email Report
        </button>
        <button className="btn btn-outline">
          ⚙️ Manage Settings
        </button>
      </div>
    </div>
  )
}

export default Dashboard