import React from "react";

const rewards = [
  { id: 1, name: "Virtual Stickers", icon: "🧡", cost: 5, description: "Collect fun virtual stickers!", color: "#FF7675" },
  { id: 2, name: "Screen Time", icon: "📺", cost: 15, description: "Extra 30 minutes of fun screen time!", color: "#74B9FF" },
  { id: 3, name: "Choose a Game", icon: "🎮", cost: 25, description: "Pick any game to play!", color: "#A29BFE" },
  { id: 4, name: "Special Badge", icon: "🏆", cost: 30, description: "Earn a special achievement badge!", color: "#FFE66D" },
  { id: 5, name: "Story Time", icon: "📖", cost: 20, description: "Your tutor reads you a special story!", color: "#55EFC4" },
  { id: 6, name: "Music Time", icon: "🎵", cost: 15, description: "Listen to your favorite songs!", color: "#FD79A8" },
  { id: 7, name: "Art Supplies", icon: "🎨", cost: 35, description: "New coloring page or drawing activity!", color: "#FAB1A0" },
  { id: 8, name: "Snack Break", icon: "🍎", cost: 10, description: "Take a fun snack break!", color: "#81ECEC" },
  { id: 9, name: "Outdoor Fun", icon: "🌳", cost: 40, description: "Ideas for outdoor activities!", color: "#55EFC4" },
  { id: 10, name: "Big Prize", icon: "🎁", cost: 100, description: "A special reward chosen by parent!", color: "#FDCB6E" },
];

const achievements = [
  { id: 1, name: "First Steps", icon: "👣", earnedAt: 5 },
  { id: 2, name: "Curious Mind", icon: "🧠", earnedAt: 20 },
  { id: 3, name: "Learning Star", icon: "⭐", earnedAt: 50 },
  { id: 4, name: "Super Scholar", icon: "🎓", earnedAt: 100 },
  { id: 5, name: "Knowledge Champion", icon: "🏅", earnedAt: 200 },
];

const Rewards = ({ totalStars, redeemedRewards = [], gamification = {}, onRedeemReward }) => {
  const handleRedeemReward = (reward) => {
    if (totalStars >= reward.cost && !redeemedRewards.includes(String(reward.id))) {
      onRedeemReward(reward.id);
      alert(`You redeemed ${reward.name}! 🎉`);
    }
  };

  const sortedRewards = [...rewards].sort((a, b) => a.cost - b.cost);

  return (
    <div className="rewards">
      <header className="page-header">
        <h1 className="page-title">Rewards & Achievements ⭐</h1>
        <p className="page-subtitle">Earn stars and redeem exciting rewards!</p>
      </header>

      <section className="rewards-balance">
        <div className="rewards-balance-icon">⭐</div>
        <h2>{totalStars}</h2>
        <p>Total Stars Earned!</p>
        <small>Keep learning to earn more stars 🚀</small>
      </section>

      {Array.isArray(gamification.dailyQuests) && gamification.dailyQuests.length > 0 && (
        <section className="rewards-section">
          <h2>Daily Quests 🎯</h2>
          <div className="rewards-grid">
            {gamification.dailyQuests.map((quest) => {
              const percent = Math.min(100, Math.round(((quest.progress || 0) / (quest.target || 1)) * 100));
              return (
                <div key={quest.id} className="reward-card">
                  <h3>{quest.label}</h3>
                  <p>{quest.completed ? "Completed today ✅" : `${quest.progress || 0} / ${quest.target || 0}`}</p>
                  <span className="reward-cost">+{quest.rewardStars || 0} ⭐</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="camera-privacy-note">
            Streak shields: {gamification.streakShields || 0} | Calm comebacks: {gamification.calmComebacks || 0} | Quest bonuses earned: {gamification.totalQuestBonuses || 0} ⭐
          </p>
        </section>
      )}

      <section className="rewards-section">
        <h2>Achievements 🏆</h2>
        <div className="rewards-grid achievements-grid">
          {achievements.map((achievement) => {
            const earned = totalStars >= achievement.earnedAt;
            return (
              <div key={achievement.id} className={`reward-card achievement-card ${earned ? "earned" : ""}`}>
                <div className="reward-icon">{achievement.icon}</div>
                <h3>{achievement.name}</h3>
                <span>{earned ? "Earned! ✅" : `${achievement.earnedAt} stars`}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rewards-section">
        <h2>Redeem Rewards 🎁</h2>
        <div className="rewards-grid">
          {sortedRewards.map((reward) => {
            const canAfford = totalStars >= reward.cost;
            const isRedeemed = redeemedRewards.includes(String(reward.id));

            return (
              <div key={reward.id} className="reward-card" style={{ borderColor: canAfford ? reward.color : undefined }}>
                <div className="reward-icon">{reward.icon}</div>
                <h3>{reward.name}</h3>
                <p>{reward.description}</p>
                <span className="reward-cost">⭐ {reward.cost}</span>
                <button
                  className={`btn ${canAfford && !isRedeemed ? "btn-primary" : "btn-outline"}`}
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canAfford || isRedeemed}
                >
                  {isRedeemed ? "Redeemed ✅" : canAfford ? "Redeem 🎉" : `Need ${reward.cost} ⭐`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {redeemedRewards.length > 0 && (
        <section className="rewards-section">
          <h2>Reward History 📜</h2>
          <div className="reward-history">
            {redeemedRewards.map((rewardId) => {
              const reward = rewards.find((item) => String(item.id) === String(rewardId));
              if (!reward) return null;

              return (
                <div key={rewardId} className="reward-history-row">
                  <span>{reward.icon}</span>
                  <strong>{reward.name}</strong>
                  <small>Claimed ✅</small>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rewards-tip">
        <h3>Tips to Earn More Stars 💡</h3>
        <ul>
          <li>Complete lessons to earn 5-10 stars each.</li>
          <li>Try different lessons to learn new things.</li>
          <li>Ask questions in chat. Curiosity is great!</li>
          <li>Practice a little every day.</li>
        </ul>
      </section>
    </div>
  );
};

export default Rewards;
