import React, { useState } from 'react'

const Rewards = ({ totalStars }) => {
  const [redeemedRewards, setRedeemedRewards] = useState([])

  const rewards = [
    {
      id: 1,
      name: 'Virtual Stickers',
      icon: '🧡',
      cost: 5,
      description: 'Collect fun virtual stickers!',
      color: '#FF7675'
    },
    {
      id: 2,
      name: 'Screen Time',
      icon: '📺',
      cost: 15,
      description: 'Extra 30 minutes of fun screen time!',
      color: '#74B9FF'
    },
    {
      id: 3,
      name: 'Choose a Game',
      icon: '🎮',
      cost: 25,
      description: 'Pick any game to play!',
      color: '#A29BFE'
    },
    {
      id: 4,
      name: 'Special Badge',
      icon: '🏆',
      cost: 30,
      description: 'Earn a special achievement badge!',
      color: '#FFE66D'
    },
    {
      id: 5,
      name: 'Story Time',
      icon: '📖',
      cost: 20,
      description: 'Your tutor reads you a special story!',
      color: '#55EFC4'
    },
    {
      id: 6,
      name: 'Music Time',
      icon: '🎵',
      cost: 15,
      description: 'Listen to your favorite songs!',
      color: '#FD79A8'
    },
    {
      id: 7,
      name: 'Art Supplies',
      icon: '🎨',
      cost: 35,
      description: 'New coloring page or drawing activity!',
      color: '#FAB1A0'
    },
    {
      id: 8,
      name: 'Snack Break',
      icon: '🍎',
      cost: 10,
      description: 'Take a fun snack break!',
      color: '#81ECEC'
    },
    {
      id: 9,
      name: 'Outdoor Fun',
      icon: '🌳',
      cost: 40,
      description: 'Ideas for outdoor activities!',
      color: '#55EFC4'
    },
    {
      id: 10,
      name: 'Big Prize',
      icon: '🎁',
      cost: 100,
      description: 'A special reward chosen by parent!',
      color: '#FDCB6E'
    }
  ]

  const achievements = [
    { id: 1, name: 'First Steps', icon: '👶', earned: totalStars >= 5 },
    { id: 2, name: 'Curious Mind', icon: '🧠', earned: totalStars >= 20 },
    { id: 3, name: 'Learning Star', icon: '⭐', earned: totalStars >= 50 },
    { id: 4, name: 'Super Scholar', icon: '🎓', earned: totalStars >= 100 },
    { id: 5, name: 'Knowledge Champion', icon: '🏅', earned: totalStars >= 200 }
  ]

  const handleRedeemReward = (reward) => {
    if (totalStars >= reward.cost && !redeemedRewards.includes(reward.id)) {
      setRedeemedRewards([...redeemedRewards, reward.id])
      alert(`🎉 You redeemed: ${reward.name}! Enjoy your reward!`)
    }
  }

  const sortedRewards = [...rewards].sort((a, b) => a.cost - b.cost)

  return (
    <div className="rewards">
      <header className="page-header">
        <h1 className="page-title">⭐ Rewards & Achievements</h1>
        <p className="page-subtitle">Earn stars and redeem exciting rewards!</p>
      </header>

      {/* Star Balance */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #FFE66D 0%, #FFB74D 100%)',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>⭐</div>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#2C3E50' }}>
          {totalStars}
        </h2>
        <p style={{ fontSize: '18px', color: '#5D6D7E' }}>Total Stars Earned!</p>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#5D6D7E' }}>
          Keep learning to earn more stars!
        </p>
      </div>

      {/* Achievements Section */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🏆 Achievements
        </h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="card"
              style={{
                textAlign: 'center',
                opacity: achievement.earned ? 1 : 0.5,
                background: achievement.earned ? 'linear-gradient(135deg, #FFE66D 0%, #FFB74D 100%)' : '#F5F9FC',
                border: achievement.earned ? '3px solid #F57F17' : '2px solid #E8EEF2'
              }}
            >
              <div style={{ 
                fontSize: '40px', 
                marginBottom: '8px',
                filter: achievement.earned ? 'none' : 'grayscale(100%)'
              }}>
                {achievement.icon}
              </div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: achievement.earned ? '#2C3E50' : '#8E99A4'
              }}>
                {achievement.name}
              </h3>
              {achievement.earned ? (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#66BB6A',
                  fontWeight: '600'
                }}>
                  ✓ Earned!
                </span>
              ) : (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#8E99A4'
                }}>
                  Keep learning!
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Available Rewards */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '20px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎁 Redeem Rewards
        </h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {sortedRewards.map((reward) => {
            const canAfford = totalStars >= reward.cost
            const isRedeemed = redeemedRewards.includes(reward.id)
            
            return (
              <div 
                key={reward.id}
                className="card"
                style={{
                  border: `3px solid ${canAfford ? reward.color : '#E8EEF2'}`,
                  opacity: isRedeemed ? 0.7 : 1
                }}
              >
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  {reward.icon}
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  {reward.name}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#5D6D7E',
                  textAlign: 'center',
                  marginBottom: '12px'
                }}>
                  {reward.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ 
                    background: '#FFF8E1',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    color: '#F57F17'
                  }}>
                    ⭐ {reward.cost}
                  </span>
                </div>
                <button
                  className={`btn ${canAfford && !isRedeemed ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%' }}
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canAfford || isRedeemed}
                >
                  {isRedeemed ? '✓ Redeemed!' : canAfford ? '🎉 Redeem!' : `Need ⭐ ${reward.cost}`}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Reward History */}
      {redeemedRewards.length > 0 && (
        <section>
          <h2 style={{ 
            fontSize: '20px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📜 Reward History
          </h2>
          <div className="card">
            {redeemedRewards.map((rewardId) => {
              const reward = rewards.find(r => r.id === rewardId)
              return (
                <div 
                  key={rewardId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #E8EEF2'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{reward.icon}</span>
                  <span style={{ fontWeight: '600' }}>{reward.name}</span>
                  <span style={{ marginLeft: 'auto', color: '#66BB6A', fontWeight: '600' }}>
                    ✓ Claimed
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Tips for Earning More Stars */}
      <div className="card" style={{ 
        marginTop: '24px', 
        background: '#E3F2FD',
        border: '2px solid #5B9BD5'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💡 Tips to Earn More Stars
        </h3>
        <ul style={{ 
          fontSize: '14px', 
          color: '#5D6D7E', 
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>Complete lessons to earn 5-10 stars each!</li>
          <li>Try different lessons to learn new things</li>
          <li>Ask questions in the chat - curiosity is great!</li>
          <li>Practice what you learn every day</li>
        </ul>
      </div>
    </div>
  )
}

export default Rewards

