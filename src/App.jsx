import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Learning from './pages/Learning'
import Rewards from './pages/Rewards'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import './styles/main.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [userProgress, setUserProgress] = useState({
    totalStars: 0,
    completedLessons: [],
    currentStreak: 0,
    lastActiveDate: null,
    achievements: [],
    preferences: {
      fontSize: 'medium',
      animations: true,
      soundEffects: true,
      theme: 'calm-blue'
    }
  })

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('autismTutorProgress')
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  useEffect(() => {
    // Save user progress to localStorage
    localStorage.setItem('autismTutorProgress', JSON.stringify(userProgress))
  }, [userProgress])

  const updateProgress = (updates) => {
    setUserProgress(prev => ({
      ...prev,
      ...updates
    }))
  }

  const addStars = (amount) => {
    updateProgress({ totalStars: userProgress.totalStars + amount })
  }

  const completeLesson = (lessonId) => {
    if (!userProgress.completedLessons.includes(lessonId)) {
      updateProgress({
        completedLessons: [...userProgress.completedLessons, lessonId],
        totalStars: userProgress.totalStars + 5
      })
    }
  }

  return (
    <Router>
      <div className="app">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView}
          totalStars={userProgress.totalStars}
        />
        <main className="main-content">
          {currentView === 'home' && <Home onStartLearning={() => setCurrentView('learning')} />}
          {currentView === 'chat' && <Chat userProgress={userProgress} />}
          {currentView === 'learning' && <Learning 
            onCompleteLesson={completeLesson} 
            addStars={addStars}
            userProgress={userProgress}
          />}
          {currentView === 'rewards' && <Rewards totalStars={userProgress.totalStars} />}
          {currentView === 'dashboard' && <Dashboard userProgress={userProgress} />}
          {currentView === 'settings' && <Settings 
            preferences={userProgress.preferences} 
            onUpdatePreferences={(prefs) => updateProgress({ preferences: prefs })}
          />}
        </main>
      </div>
    </Router>
  )
}

export default App

