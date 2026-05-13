import React, { useState } from "react";

const themes = [
  { id: "calm-blue", name: "Calm Blue", color: "#5B9BD5", description: "Soothing blue tones" },
  { id: "nature-green", name: "Nature Green", color: "#7CB342", description: "Fresh green colors" },
  { id: "soft-purple", name: "Soft Purple", color: "#9575CD", description: "Gentle purple shades" },
  { id: "warm-peach", name: "Warm Peach", color: "#FFB74D", description: "Cozy warm colors" },
];

const fontSizes = [
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
  { id: "extra-large", name: "Extra Large" },
];

const Settings = ({ preferences, onUpdatePreferences }) => {
  const [parentPinInput, setParentPinInput] = useState("");
  const [isParentMode, setIsParentMode] = useState(false);
  const [pinError, setPinError] = useState("");

  const updatePreference = (key, value) => {
    onUpdatePreferences({
      ...preferences,
      [key]: value,
    });
  };

  const unlockParentMode = (event) => {
    event.preventDefault();
    if (parentPinInput === (preferences.parentPin || "1234")) {
      setIsParentMode(true);
      setPinError("");
      setParentPinInput("");
    } else {
      setPinError("That PIN did not match.");
    }
  };

  return (
    <div className="settings">
      <header className="page-header">
        <h1 className="page-title">Settings ⚙️</h1>
        <p className="page-subtitle">Customize your learning experience.</p>
      </header>

      <section className="settings-section">
        <h2 className="settings-title">Accessibility ♿</h2>

        <div className="settings-option">
          <div>
            <div className="settings-label">Font Size 🔠</div>
            <div className="settings-description">Choose comfortable text size for reading.</div>
          </div>
          <div className="settings-button-row">
            {fontSizes.map((size) => (
              <button
                key={size.id}
                className={`btn btn-small ${preferences.fontSize === size.id ? "btn-primary" : "btn-outline"}`}
                onClick={() => updatePreference("fontSize", size.id)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Animations ✨</div>
            <div className="settings-description">Enable or reduce movement effects.</div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.animations}
              onChange={(event) => updatePreference("animations", event.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Sound Effects 🔊</div>
            <div className="settings-description">Play sounds for interactions and feedback.</div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={preferences.soundEffects}
              onChange={(event) => updatePreference("soundEffects", event.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-title">Theme 🎨</h2>
        <div className="settings-theme-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`settings-theme-card ${preferences.theme === theme.id ? "active" : ""}`}
              onClick={() => updatePreference("theme", theme.id)}
              style={{ borderColor: preferences.theme === theme.id ? theme.color : undefined }}
            >
              <span style={{ background: theme.color }} />
              <strong>{theme.name}</strong>
              <small>{theme.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-title">Learning Preferences 📚</h2>
        {[
          ["autoReadLessons", "Auto-read Lessons 🔈", "Automatically read lesson content aloud."],
          ["repeatQuizQuestions", "Repeat Quiz Questions 🔁", "Show questions multiple times for practice."],
          ["showHints", "Show Hints 💡", "Display helpful hints during activities."],
        ].map(([key, title, description]) => (
          <div className="settings-option" key={key}>
            <div>
              <div className="settings-label">{title}</div>
              <div className="settings-description">{description}</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={Boolean(preferences[key])}
                onChange={(event) => updatePreference(key, event.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
      </section>

      <section className="settings-section parent-mode-section">
        <h2 className="settings-title">Parent Mode 👨‍👩‍👧</h2>
        {isParentMode ? (
          <div className="parent-mode-status">
            <span>Unlocked ✅</span>
            <button className="btn btn-small btn-outline" onClick={() => setIsParentMode(false)}>
              Lock
            </button>
          </div>
        ) : (
          <form className="parent-pin-form" onSubmit={unlockParentMode}>
            <input
              type="password"
              value={parentPinInput}
              onChange={(event) => setParentPinInput(event.target.value)}
              placeholder="Enter parent PIN"
              aria-label="Parent PIN"
            />
            <button className="btn btn-primary" type="submit">
              Unlock 🔒
            </button>
            {pinError && <p className="auth-error">{pinError}</p>}
            <small>Default PIN is 1234. Change it after unlocking.</small>
          </form>
        )}
      </section>

      {isParentMode && (
        <section className="settings-section">
          <h2 className="settings-title">Parent Controls 👨‍👩‍👧</h2>

        <div className="settings-option">
          <div>
            <div className="settings-label">Daily Time Limit ⏱️</div>
            <div className="settings-description">Set maximum daily learning time.</div>
          </div>
          <select
            className="settings-select"
            value={preferences.dailyTimeLimit}
            onChange={(event) => updatePreference("dailyTimeLimit", event.target.value)}
          >
            <option value="30-minutes">30 minutes</option>
            <option value="1-hour">1 hour</option>
            <option value="2-hours">2 hours</option>
            <option value="none">No limit</option>
          </select>
        </div>

        {[
          ["requireBreak", "Require Break 🧘", "Prompt for breaks after learning sessions."],
          ["progressReports", "Progress Reports 📊", "Save weekly progress report preference."],
          ["anonymousAnalytics", "Anonymous Analytics 🔒", "Help improve the app with usage data."],
        ].map(([key, title, description]) => (
          <div className="settings-option" key={key}>
            <div>
              <div className="settings-label">{title}</div>
              <div className="settings-description">{description}</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={Boolean(preferences[key])}
                onChange={(event) => updatePreference(key, event.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        ))}
          <div className="settings-option">
            <div>
              <div className="settings-label">Parent PIN 🔑</div>
              <div className="settings-description">Change the PIN used to unlock parent mode.</div>
            </div>
            <input
              className="settings-select"
              type="text"
              value={preferences.parentPin || "1234"}
              onChange={(event) => updatePreference("parentPin", event.target.value)}
            />
          </div>
        </section>
      )}

      {isParentMode && (
        <section className="settings-section">
          <h2 className="settings-title">Data & Privacy 🔒</h2>
          <p className="settings-description">
            Progress is saved to your account so lessons, stars, rewards, settings, and reports stay available after login.
          </p>
        </section>
      )}
    </div>
  );
};

export default Settings;
