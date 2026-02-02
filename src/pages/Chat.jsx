import React, { useState, useRef, useEffect } from 'react'

const Chat = ({ userProgress }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: '👋 Hi there! I am your friendly Autism Tutor!',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'ai',
      text: 'I am here to help you learn new things and answer your questions. What would you like to talk about today?',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const aiResponses = [
    "That's a great question! Let me explain...",
    "I love that you're curious! Here's what I think...",
    "You know what? That's really interesting!",
    "I'm happy to help you with that! Here's more information...",
    "That's awesome! Learning new things is so much fun!",
    "Great thinking! Let me tell you more about that...",
    "You asked a wonderful question! Here's the answer..."
  ]

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    'Tell me about animals',
    'How do I count?',
    'What are colors?',
    'Can you teach me shapes?',
    'I want to learn words',
    'Tell me a fun fact'
  ]

  return (
    <div className="chat">
      <header className="page-header">
        <h1 className="page-title">💬 Chat with Your Tutor</h1>
        <p className="page-subtitle">Ask questions and learn new things!</p>
      </header>

      {/* Quick Questions */}
      <div className="card" style={{ marginBottom: '16px', background: '#E3F2FD' }}>
        <h3 style={{ 
          fontSize: '16px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💡 Quick Questions You Can Ask:
        </h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px'
        }}>
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="btn btn-small"
              style={{ 
                background: 'white',
                color: '#5B9BD5',
                border: '2px solid #5B9BD5'
              }}
              onClick={() => setInputText(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-header">
          <span style={{ fontSize: '32px' }}>🤖</span>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Autism Tutor</h2>
            <span style={{ fontSize: '12px', opacity: 0.9 }}>Always here to help!</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.type === 'ai' ? 'message-ai' : 'message-user'}`}
            >
              {message.type === 'ai' && (
                <span style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  marginBottom: '8px',
                  opacity: 0.7
                }}>
                  🤖 Autism Tutor
                </span>
              )}
              <p style={{ margin: 0, lineHeight: '1.6' }}>{message.text}</p>
              <span style={{ 
                display: 'block',
                fontSize: '10px',
                marginTop: '8px',
                opacity: 0.6
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isTyping && (
            <div className="message message-ai">
              <span style={{ 
                display: 'block', 
                fontSize: '12px', 
                marginBottom: '8px',
                opacity: 0.7
              }}>
                🤖 Autism Tutor
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ animation: 'bounce 0.6s infinite' }}>●</span>
                <span style={{ animation: 'bounce 0.6s infinite 0.1s' }}>●</span>
                <span style={{ animation: 'bounce 0.6s infinite 0.2s' }}>●</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your question here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Chat input"
          />
          <button 
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            style={{ 
              padding: '12px 24px',
              background: inputText.trim() ? '#5B9BD5' : '#ccc'
            }}
          >
            <span style={{ fontSize: '20px' }}>➤</span>
          </button>
        </div>
      </div>

      {/* Chat Tips */}
      <div className="card" style={{ 
        marginTop: '16px', 
        background: '#E8F5E9',
        border: '2px solid #AED581'
      }}>
        <h3 style={{ 
          fontSize: '14px', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💬 Chat Tips:
        </h3>
        <ul style={{ 
          fontSize: '14px', 
          color: '#5D6D7E', 
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>Ask me anything you want to learn about</li>
          <li>I can help with homework, stories, or just chatting</li>
          <li>Take your time - there's no rush!</li>
        </ul>
      </div>
    </div>
  )
}

export default Chat

