import React from 'react'

const Settings = ({ preferences, onUpdatePreferences }) => {
  const handleToggle = (key) => {
    onUpdatePreferences({
      ...preferences,
      [key]: !preferences[key]
    })
  }

  const handleFontSizeChange = (size) => {
    onUpdatePreferences({
      ...preferences,
      fontSize: size
    })
  }

  const handleThemeChange = (theme) => {
    onUpdatePreferences({
      ...preferences,
      theme: theme
    })
  }

  const themes = [
    { id: 'calm-blue', name: 'Calm Blue', color: '#5B9BD5', description: 'Soothing blue tones' },
    { id: 'nature-green', name: 'Nature Green', color: '#7CB342', description: 'Fresh green colors' },
    { id: 'soft-purple', name: 'Soft Purple', color: '#9575CD', description: 'Gentle purple shades' },
    { id: 'warm-peach', name: 'Warm Peach', color: '#FFB74D', description: 'Cozy warm colors' }
  ]

  const fontSizes = [
    { id: 'small', name: 'Small', size: '14px' },
    { id: 'medium', name: 'Medium', size: '16px' },
    { id: 'large', name: 'Large', size: '18px' },
    { id: 'extra-large', name: 'Extra Large', size: '20px' }
  ]

  return (
    <div className="settings">
      <header className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Customize your learning experience</p>
      </header>

      {/* Accessibility Settings */}
      <section className="settings-section">
        <h2 className="settings-title">
          ♿ Accessibility
        </h2>
        
        <div className="settings-option">
          <div>
            <div className="settings-label">Font Size</div>
            <div className="settings-description">Choose comfortable text size for reading</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {fontSizes.map((size) => (
              <button
                key={size.id}
                className={`btn ${preferences.fontSize === size.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: size.size, padding: '6px 12px' }}
                onClick={() => handleFontSizeChange(size.id)}
              >
                A
              </button>
            ))}
          </div>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Animations</div>
            <div className="settings-description">Enable or reduce movement effects</div>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={preferences.animations}
              onChange={() => handleToggle('animations')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Sound Effects</div>
            <div className="settings-description">Play sounds for interactions and feedback</div>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={preferences.soundEffects}
              onChange={() => handleToggle('soundEffects')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Theme Settings */}
      <section className="settings-section">
        <h2 className="settings-title">
          🎨 Theme
        </h2>
        <p style={{ fontSize: '14px', color: '#5D6D7E', marginBottom: '16px' }}>
          Choose a color theme that feels comfortable
        </p>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="card"
              onClick={() => handleThemeChange(theme.id)}
              style={{
                cursor: 'pointer',
                border: preferences.theme === theme.id ? `3px solid ${theme.color}` : '2px solid #E8EEF2',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px 8px 0 0',
                margin: '-16px -16px 12px -16px',
                background: theme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px', opacity: 0.8 }}>
                  {preferences.theme === theme.id ? '✓' : ''}
                </span>
              </div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{theme.name}</div>
              <div style={{ fontSize: '12px', color: '#5D6D7E' }}>{theme.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Preferences */}
      <section className="settings-section">
        <h2 className="settings-title">
          📚 Learning Preferences
        </h2>
        
        <div className="settings-option">
          <div>
            <div className="settings-label">Auto-read Lessons</div>
            <div className="settings-description">Automatically read lesson content aloud</div>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Repeat Quiz Questions</div>
            <div className="settings-description">Show questions multiple times for practice</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Show Hints</div>
            <div className="settings-description">Display helpful hints during activities</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Parent Controls */}
      <section className="settings-section">
        <h2 className="settings-title">
          👨‍👩‍👧 Parent Controls
        </h2>
        
        <div className="settings-option">
          <div>
            <div className="settings-label">Daily Time Limit</div>
            <div className="settings-description">Set maximum daily learning time</div>
          </div>
          <select style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #E8EEF2',
            fontSize: '14px'
          }}>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option selected>2 hours</option>
            <option>No limit</option>
          </select>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Require Break</div>
            <div className="settings-description">Prompt for breaks after learning sessions</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Progress Reports</div>
            <div className="settings-description">Receive weekly learning progress emails</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="settings-section">
        <h2 className="settings-title">
          🔒 Data & Privacy
        </h2>
        
        <div className="settings-option">
          <div>
            <div className="settings-label">Save Progress</div>
            <div className="settings-description">Automatically save learning progress</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked disabled />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <div className="settings-label">Anonymous Analytics</div>
            <div className="settings-description">Help improve the app with usage data</div>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </section>

      {/* Help & Support */}
      <section className="settings-section">
        <h2 className="settings-title">
          💬 Help & Support
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            📖 View Tutorial
          </button>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            ❓ FAQ
          </button>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            📧 Contact Support
          </button>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            📝 Send Feedback
          </button>
        </div>
      </section>

      {/* Reset Progress */}
      <div className="card" style={{ 
        background: '#FFEBEE',
        border: '2px solid #EF5350'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          marginBottom: '8px',
          color: '#C62828'
        }}>
          ⚠️ Danger Zone
        </h3>
        <p style={{ fontSize: '14px', color: '#5D6D7E', marginBottom: '16px' }}>
          These actions are permanent and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-small" style={{ background: '#FFA726', color: 'white' }}>
            🔄 Reset Progress
          </button>
          <button className="btn btn-small" style={{ background: '#EF5350', color: 'white' }}>
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {/* Version Info */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '24px',
        fontSize: '14px',
        color: '#8E99A4'
      }}>
        <p>Autism Tutor v1.0.0</p>
        <p>Made with ❤️ for neurodiverse learners</p>
      </div>
    </div>
  )
}

export default Settings

