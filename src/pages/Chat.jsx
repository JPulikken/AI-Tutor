import React, { useEffect, useMemo, useRef, useState } from "react";
import CameraView from "../components/CameraView";
import { chatWithTutor } from "../api/api";

const lessonNames = {
  "colors-1": "colors",
  "numbers-1": "numbers",
  "letters-1": "letters",
  "shapes-1": "shapes",
  "basics-1": "emotions",
  "social-1": "social skills",
};

const buildTutorReply = (text, userProgress, childName = "") => {
  const message = text.toLowerCase();
  const completed = userProgress.completedLessons || [];
  const completedNames = completed.map((id) => lessonNames[id] || id);
  const childLabel = childName ? ` for ${childName}` : "";

  if (message.includes("progress") || message.includes("report")) {
    return `Here is your learning snapshot${childLabel}: ${completed.length} lesson${completed.length === 1 ? "" : "s"} completed, ${userProgress.totalStars} stars earned, and a ${userProgress.currentStreak || 0}-day streak.`;
  }

  if (message.includes("mood") || message.includes("emotion") || message.includes("feel")) {
    return "Feelings are important. If you feel happy, we can try a challenge. If you feel tired, sad, or frustrated, we can slow down, take a break, or choose an easier lesson.";
  }

  if (message.includes("color")) {
    return "Let's learn colors. Red can be an apple, blue can be the sky, yellow can be the sun, and green can be grass. Can you find something blue near you?";
  }

  if (message.includes("number") || message.includes("count")) {
    return "Let's count together: 1, 2, 3, 4, 5. A good trick is to touch one object for each number so your eyes and hands help your brain.";
  }

  if (message.includes("shape")) {
    return "Shapes are everywhere. A circle is round, a square has 4 equal sides, and a triangle has 3 sides. Try looking for one shape in the room.";
  }

  if (message.includes("letter") || message.includes("word")) {
    return "Letters make words. We can start with sounds: A is for apple, B is for ball, and C is for cat. Tell me a letter and I will help with a word.";
  }

  if (message.includes("lesson") || message.includes("learn")) {
    const learned = completedNames.length ? `You have already worked on ${completedNames.join(", ")}.` : "You are just getting started.";
    return `${learned} A nice next step is one short lesson, then a break. Which topic sounds good: colors, numbers, letters, shapes, or emotions?`;
  }

  if (message.includes("help") || message.includes("hard")) {
    return "We can make it easier. First, take one small step. Then try one question. If it feels hard, that does not mean you failed. It means we should use more practice and hints.";
  }

  return "I can help with learning, feelings, progress, and reports. You can ask things like: What should I learn next? How is my progress? Teach me colors. I feel frustrated.";
};

const quickQuestions = [
  "How is my progress?",
  "What should I learn next?",
  "Teach me colors",
  "Help me count",
  "I feel frustrated",
  "Explain my report",
];

const Chat = ({ userProgress, authToken, children = [], selectedChildId }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hi 👋 I am your tutor 🤖. I can help with lessons, feelings, progress, and reports.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [chatMemory, setChatMemory] = useState(null);
  const messagesEndRef = useRef(null);
  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId) || children[0],
    [children, selectedChildId]
  );

  const progressSummary = useMemo(
    () => `${userProgress.completedLessons.length} lessons complete, ${userProgress.totalStars} stars`,
    [userProgress.completedLessons.length, userProgress.totalStars]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const history = [...messages, userMessage]
        .slice(-12)
        .map((item) => ({
          role: item.type === "user" ? "user" : "assistant",
          text: item.text,
        }));

      const data = await chatWithTutor(authToken, {
        message: text,
        context: {
          history,
          childId: selectedChild?.id || "",
          childName: selectedChild?.name || "",
        },
      });
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: "ai",
          text: data.reply || buildTutorReply(text, userProgress, selectedChild?.name),
          timestamp: new Date(),
        },
      ]);
      if (data.context?.memory) {
        setChatMemory(data.context.memory);
      }
    } catch (err) {
      console.error(err);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: "ai",
          text: buildTutorReply(text, userProgress, selectedChild?.name),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat">
      <CameraView isActive={showCamera} onClose={() => setShowCamera(false)} />

      <header className="page-header chat-page-header">
        <div>
          <h1 className="page-title">Chat with Your Tutor 💬</h1>
          <p className="page-subtitle">Ask questions, review progress, or talk about feelings.</p>
        </div>
        <button
          className={`btn ${showCamera ? "btn-primary" : "btn-outline"}`}
          type="button"
          onClick={() => setShowCamera((value) => !value)}
        >
          {showCamera ? "Camera On 📷" : "Camera Off 📷"}
        </button>
      </header>

      <section className="chat-context">
        <span>⭐ {progressSummary}</span>
        <span>
          Child: {selectedChild?.avatar || "🧒"} {selectedChild?.name || "Not selected"} | Ask about progress, reports, lessons, or mood 🌈
        </span>
      </section>

      {chatMemory && (
        <section className="chat-context">
          <span>Memory Summary: {chatMemory.summary || "Building memory..."}</span>
          <span>
            Goals: {(chatMemory.goals || []).slice(0, 2).join(", ") || "None"} | Focus: {(chatMemory.focusAreas || []).slice(0, 2).join(", ") || "None"}
          </span>
        </section>
      )}

      <section className="chat-quick-questions">
        {quickQuestions.map((question) => (
          <button key={question} className="btn btn-small btn-outline" onClick={() => sendMessage(question)}>
            {question}
          </button>
        ))}
      </section>

      <div className="chat-container">
        <div className="chat-header">
          <div>
            <h2>Autism Tutor 🤖</h2>
            <span>Calm, patient, and ready to help 🌟</span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type === "ai" ? "message-ai" : "message-user"}`}>
              {message.type === "ai" && <span className="message-author">Tutor 🤖</span>}
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="message message-ai">
              <span className="message-author">Tutor 🤖</span>
              <p>Thinking... ✨</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your question here"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            aria-label="Chat input"
          />
          <button className="btn btn-primary" onClick={() => sendMessage()} disabled={!inputText.trim()}>
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
