import React, { useState } from 'react'
import CameraView from '../components/CameraView'

const Learning = ({ onCompleteLesson, addStars, userProgress }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeLesson, setActiveLesson] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'basics', name: 'Basics', icon: '🎯' },
    { id: 'numbers', name: 'Numbers', icon: '🔢' },
    { id: 'letters', name: 'Letters', icon: '🔤' },
    { id: 'shapes', name: 'Shapes', icon: '🔷' },
    { id: 'colors', name: 'Colors', icon: '🌈' },
    { id: 'social', name: 'Social Skills', icon: '👥' }
  ]

  const lessons = [
    {
      id: 'colors-1',
      category: 'colors',
      title: 'Learn Colors',
      icon: '🌈',
      description: 'Learn the names of different colors',
      duration: '10 min',
      stars: 5,
      content: {
        type: 'interactive',
        items: [
          { name: 'Red', color: '#FF6B6B', emoji: '🍎' },
          { name: 'Blue', color: '#4ECDC4', emoji: '🌊' },
          { name: 'Yellow', color: '#FFE66D', emoji: '☀️' },
          { name: 'Green', color: '#95E1D3', emoji: '🌿' },
          { name: 'Orange', color: '#F38181', emoji: '🍊' },
          { name: 'Purple', color: '#AA96DA', emoji: '🍇' }
        ],
        quiz: [
          { question: 'What color is this apple?', answer: 'red', options: ['red', 'blue', 'green'] },
          { question: 'What color is the ocean?', answer: 'blue', options: ['yellow', 'blue', 'red'] },
          { question: 'What color is grass?', answer: 'green', options: ['green', 'orange', 'purple'] }
        ]
      }
    },
    {
      id: 'numbers-1',
      category: 'numbers',
      title: 'Counting 1-10',
      icon: '🔢',
      description: 'Learn to count from 1 to 10',
      duration: '15 min',
      stars: 10,
      content: {
        type: 'interactive',
        items: [
          { name: 'One', number: 1, emoji: '1️⃣' },
          { name: 'Two', number: 2, emoji: '2️⃣' },
          { name: 'Three', number: 3, emoji: '3️⃣' },
          { name: 'Four', number: 4, emoji: '4️⃣' },
          { name: 'Five', number: 5, emoji: '5️⃣' },
          { name: 'Six', number: 6, emoji: '6️⃣' },
          { name: 'Seven', number: 7, emoji: '7️⃣' },
          { name: 'Eight', number: 8, emoji: '8️⃣' },
          { name: 'Nine', number: 9, emoji: '9️⃣' },
          { name: 'Ten', number: 10, emoji: '🔟' }
        ],
        quiz: [
          { question: 'What comes after 5?', answer: '6', options: ['5', '6', '7'] },
          { question: 'How many fingers on one hand?', answer: '5', options: ['5', '10', '6'] },
          { question: 'What is 3 + 2?', answer: '5', options: ['4', '5', '6'] }
        ]
      }
    },
    {
      id: 'letters-1',
      category: 'letters',
      title: 'ABC Letters',
      icon: '🔤',
      description: 'Learn the letters of the alphabet',
      duration: '20 min',
      stars: 10,
      content: {
        type: 'interactive',
        items: [
          { letter: 'A', word: 'Apple', emoji: '🍎' },
          { letter: 'B', word: 'Ball', emoji: '⚽' },
          { letter: 'C', word: 'Cat', emoji: '🐱' },
          { letter: 'D', word: 'Dog', emoji: '🐶' },
          { letter: 'E', word: 'Elephant', emoji: '🐘' },
          { letter: 'F', word: 'Fish', emoji: '🐟' }
        ],
        quiz: [
          { question: 'What letter does Apple start with?', answer: 'A', options: ['A', 'B', 'C'] },
          { question: 'What letter does Cat start with?', answer: 'C', options: ['A', 'B', 'C'] }
        ]
      }
    },
    {
      id: 'shapes-1',
      category: 'shapes',
      title: 'Shape Hunt',
      icon: '🔷',
      description: 'Find and name different shapes',
      duration: '12 min',
      stars: 8,
      content: {
        type: 'interactive',
        items: [
          { name: 'Circle', shape: '⭕', emoji: '🔴' },
          { name: 'Square', shape: '⬜', emoji: '🟦' },
          { name: 'Triangle', shape: '🔺', emoji: '📐' },
          { name: 'Star', shape: '⭐', emoji: '🌟' },
          { name: 'Heart', shape: '❤️', emoji: '💜' }
        ],
        quiz: [
          { question: 'Which shape has 4 equal sides?', answer: 'square', options: ['circle', 'square', 'triangle'] },
          { question: 'What shape is a pizza slice?', answer: 'triangle', options: ['circle', 'square', 'triangle'] }
        ]
      }
    },
    {
      id: 'basics-1',
      category: 'basics',
      title: 'My Emotions',
      icon: '😊',
      description: 'Learn to recognize and name feelings',
      duration: '15 min',
      stars: 8,
      content: {
        type: 'interactive',
        items: [
          { name: 'Happy', emoji: '😊', color: '#FFE66D' },
          { name: 'Sad', emoji: '😢', color: '#74B9FF' },
          { name: 'Angry', emoji: '😠', color: '#FF7675' },
          { name: 'Excited', emoji: '🤩', color: '#A29BFE' },
          { name: 'Calm', emoji: '😌', color: '#55EFC4' },
          { name: 'Surprised', emoji: '😲', color: '#FD79A8' }
        ],
        quiz: [
          { question: 'When you get a gift, how do you feel?', answer: 'happy', options: ['sad', 'happy', 'angry'] },
          { question: 'When you miss your friend, how do you feel?', answer: 'sad', options: ['happy', 'sad', 'excited'] }
        ]
      }
    },
    {
      id: 'social-1',
      category: 'social',
      title: 'Saying Hello',
      icon: '👋',
      description: 'Learn different ways to greet people',
      duration: '10 min',
      stars: 5,
      content: {
        type: 'interactive',
        items: [
          { name: 'Wave Hello', emoji: '👋', description: 'Wave your hand!' },
          { name: 'Say Hi', emoji: '👋', description: 'Say "Hi!" with a smile' },
          { name: 'Wave Bye', emoji: '👋', description: 'Wave goodbye!' },
          { name: 'Please', magicWord: '✨', description: 'Say "please" when asking' },
          { name: 'Thank You', magicWord: '💫', description: 'Say "thank you"!' }
        ],
        quiz: [
          { question: 'What do you say when someone gives you something?', answer: 'thank you', options: ['please', 'thank you', 'hello'] },
          { question: 'What do you say when you want something?', answer: 'please', options: ['hello', 'please', 'goodbye'] }
        ]
      }
    }
  ]

  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory)

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson)
    setShowCamera(true)
  }

  const handleCompleteLesson = () => {
    if (activeLesson) {
      onCompleteLesson(activeLesson.id)
      addStars(activeLesson.stars)
      setShowCamera(false)
      setActiveLesson(null)
    }
  }

  const handleCloseCamera = () => {
    setShowCamera(false)
  }

  if (activeLesson) {
    return (
      <div className="learning-active">
        <CameraView isActive={showCamera} onClose={handleCloseCamera} />
        
        <button 
          className="btn btn-outline"
          onClick={() => { setActiveLesson(null); setShowCamera(false); }}
          style={{ marginBottom: '16px' }}
        >
          ← Back to Lessons
        </button>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, #5B9BD5 0%, #9575CD 100%)', color: 'white', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            {activeLesson.icon} {activeLesson.title}
          </h1>
          <p style={{ opacity: 0.95 }}>{activeLesson.description}</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px' }}>
              ⏱️ {activeLesson.duration}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px' }}>
              ⭐ {activeLesson.stars} Stars
            </span>
          </div>
        </div>

        {/* Learning Content */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>📖 Let's Learn!</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '16px' 
          }}>
            {activeLesson.content.items.map((item, index) => (
              <div 
                key={index}
                style={{
                  background: '#E3F2FD',
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                  {item.emoji || item.shape || item.color}
                </div>
                <div style={{ fontWeight: '600', color: '#2C3E50' }}>
                  {item.name || item.letter || item.word}
                </div>
                {item.number && (
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#5B9BD5' }}>
                    {item.number}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="card" style={{ marginBottom: '16px', background: '#FFF8E1' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>❓ Quick Quiz!</h2>
          {activeLesson.content.quiz.map((q, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: '600', marginBottom: '12px' }}>{q.question}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {q.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className="btn btn-small"
                    style={{
                      background: 'white',
                      color: '#5B9BD5',
                      border: '2px solid #5B9BD5'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Complete Button */}
        <button 
          className="btn btn-secondary btn-large"
          onClick={handleCompleteLesson}
          style={{ width: '100%' }}
        >
          🎉 Complete Lesson & Earn {activeLesson.stars} Stars!
        </button>
      </div>
    )
  }

  return (
    <div className="learning">
      <header className="page-header">
        <h1 className="page-title">📚 Learning Center</h1>
        <p className="page-subtitle">Choose a lesson and start learning!</p>
      </header>

      {/* Category Filter */}
      <div className="card" style={{ marginBottom: '24px', background: '#F5F9FC' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px',
          justifyContent: 'center'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ 
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-3" style={{ display: 'grid', gap: '16px' }}>
        {filteredLessons.map((lesson) => {
          const isCompleted = userProgress.completedLessons.includes(lesson.id)
          return (
            <div 
              key={lesson.id}
              className={`lesson-card ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleStartLesson(lesson)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleStartLesson(lesson)}
            >
              {isCompleted && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#66BB6A',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  ✓
                </div>
              )}
              <div className="lesson-icon">{lesson.icon}</div>
              <h3 className="lesson-title">{lesson.title}</h3>
              <p className="lesson-description">{lesson.description}</p>
              <div className="lesson-progress">
                <span style={{ fontSize: '14px', color: '#5D6D7E' }}>⏱️ {lesson.duration}</span>
                <span style={{ 
                  background: '#FFF8E1', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#F57F17'
                }}>
                  ⭐ {lesson.stars}
                </span>
              </div>
              <button 
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '12px',
                  fontSize: '14px',
                  padding: '8px 16px'
                }}
              >
                {isCompleted ? '🔄 Try Again' : '▶️ Start Lesson'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Progress Summary */}
      <div className="card" style={{ 
        marginTop: '24px', 
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '48px' }}>📊</span>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Your Learning Progress</h3>
            <p style={{ color: '#5D6D7E', fontSize: '14px' }}>
              {userProgress.completedLessons.length} of {lessons.length} lessons completed
            </p>
            <div className="progress-bar" style={{ width: '200px', marginTop: '8px' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(userProgress.completedLessons.length / lessons.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Learning

