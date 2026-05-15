import React, { useMemo, useState } from "react";
import CameraView from "../components/CameraView";
import { emotionMeta, negativeEmotions } from "../utils/emotionMapping";

const categories = [
  { id: "all", name: "All Topics", icon: "📚" },
  { id: "basics", name: "Basics", icon: "🎯" },
  { id: "numbers", name: "Numbers", icon: "🔢" },
  { id: "letters", name: "Letters", icon: "🔤" },
  { id: "shapes", name: "Shapes", icon: "🔷" },
  { id: "colors", name: "Colors", icon: "🌈" },
  { id: "social", name: "Social Skills", icon: "👋" },
];

const lessons = [
  {
    id: "colors-1",
    category: "colors",
    title: "Learn Colors",
    icon: "🌈",
    description: "Learn the names of different colors.",
    duration: "10 min",
    stars: 5,
    items: [
      { name: "Red", emoji: "🍎" },
      { name: "Blue", emoji: "🌊" },
      { name: "Yellow", emoji: "☀️" },
      { name: "Green", emoji: "🌿" },
      { name: "Orange", emoji: "🍊" },
      { name: "Purple", emoji: "🍇" },
    ],
    quiz: [
      { question: "What color is an apple?", answer: "red", options: ["red", "blue", "green"] },
      { question: "What color is the ocean?", answer: "blue", options: ["yellow", "blue", "red"] },
      { question: "What color is grass?", answer: "green", options: ["green", "orange", "purple"] },
    ],
  },
  {
    id: "numbers-1",
    category: "numbers",
    title: "Counting 1-10",
    icon: "🔢",
    description: "Learn to count from 1 to 10.",
    duration: "15 min",
    stars: 10,
    items: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"].map((name, index) => ({
      name,
      emoji: `${index + 1}`,
    })),
    quiz: [
      { question: "What comes after 5?", answer: "6", options: ["5", "6", "7"] },
      { question: "How many fingers are on one hand?", answer: "5", options: ["5", "10", "6"] },
      { question: "What is 3 + 2?", answer: "5", options: ["4", "5", "6"] },
    ],
  },
  {
    id: "letters-1",
    category: "letters",
    title: "ABC Letters",
    icon: "🔤",
    description: "Learn letters and simple words.",
    duration: "20 min",
    stars: 10,
    items: [
      { name: "A - Apple", emoji: "🍎" },
      { name: "B - Ball", emoji: "⚽" },
      { name: "C - Cat", emoji: "🐱" },
      { name: "D - Dog", emoji: "🐶" },
      { name: "E - Elephant", emoji: "🐘" },
      { name: "F - Fish", emoji: "🐟" },
    ],
    quiz: [
      { question: "What letter does Apple start with?", answer: "A", options: ["A", "B", "C"] },
      { question: "What letter does Cat start with?", answer: "C", options: ["A", "B", "C"] },
    ],
  },
  {
    id: "shapes-1",
    category: "shapes",
    title: "Shape Hunt",
    icon: "🔷",
    description: "Find and name different shapes.",
    duration: "12 min",
    stars: 8,
    items: [
      { name: "Circle", emoji: "⭕" },
      { name: "Square", emoji: "⬜" },
      { name: "Triangle", emoji: "🔺" },
      { name: "Star", emoji: "⭐" },
      { name: "Heart", emoji: "❤️" },
    ],
    quiz: [
      { question: "Which shape has 4 equal sides?", answer: "square", options: ["circle", "square", "triangle"] },
      { question: "What shape is a pizza slice?", answer: "triangle", options: ["circle", "square", "triangle"] },
    ],
  },
  {
    id: "basics-1",
    category: "basics",
    title: "My Emotions",
    icon: "😊",
    description: "Learn to recognize and name feelings.",
    duration: "15 min",
    stars: 8,
    items: [
      { name: "Happy", emoji: "😊" },
      { name: "Sad", emoji: "😢" },
      { name: "Angry", emoji: "😠" },
      { name: "Excited", emoji: "🤩" },
      { name: "Calm", emoji: "😌" },
      { name: "Surprised", emoji: "😮" },
    ],
    quiz: [
      { question: "When you get a gift, how might you feel?", answer: "happy", options: ["sad", "happy", "angry"] },
      { question: "When you miss your friend, how might you feel?", answer: "sad", options: ["happy", "sad", "excited"] },
    ],
  },
  {
    id: "social-1",
    category: "social",
    title: "Saying Hello",
    icon: "👋",
    description: "Learn friendly greetings and polite words.",
    duration: "10 min",
    stars: 5,
    items: [
      { name: "Wave Hello", emoji: "👋" },
      { name: "Say Hi", emoji: "🙂" },
      { name: "Wave Bye", emoji: "👋" },
      { name: "Please", emoji: "✨" },
      { name: "Thank You", emoji: "💫" },
    ],
    quiz: [
      { question: "What do you say when someone gives you something?", answer: "thank you", options: ["please", "thank you", "hello"] },
      { question: "What do you say when you want something?", answer: "please", options: ["hello", "please", "goodbye"] },
    ],
  },
];

const videoRecommendations = {
  "colors-1": {
    title: "Learn Colors with Wonderville Friends",
    source: "Pinkfong and Hogi",
    url: "https://www.youtube.com/results?search_query=Learn+Colors+with+Wonderville+Friends+Pinkfong+Hogi",
  },
  "numbers-1": {
    title: "Counting 1 to 10",
    source: "Pinkfong Number Songs",
    url: "https://www.youtube.com/results?search_query=Counting+1+to+10+Number+Songs+Pinkfong",
  },
  "letters-1": {
    title: "Learn ABC with Surprise Boxes",
    source: "BabyBus",
    url: "https://www.youtube.com/results?search_query=Learn+ABC+with+Surprise+Boxes+BabyBus",
  },
  "shapes-1": {
    title: "The Shape Song #2",
    source: "Super Simple Songs",
    url: "https://www.youtube.com/results?search_query=The+Shape+Song+%232+Super+Simple+Songs",
  },
  "basics-1": {
    title: "Cai & Kate emotions episodes",
    source: "Chill Project Productions",
    url: "https://www.youtube.com/results?search_query=Cai+and+Kate+emotions+for+kids",
  },
  "social-1": {
    title: "Saying Hello",
    source: "Sesame Workshop",
    url: "https://www.youtube.com/results?search_query=Sesame+Workshop+Saying+Hello+autism",
  },
};

const levelQuestionBank = {
  "colors-1": {
    easy: [
      { question: "Which color is an apple often?", answer: "red", options: ["red", "blue", "yellow"] },
      { question: "Which color is the sky on a clear day?", answer: "blue", options: ["green", "blue", "orange"] },
      { question: "Which color is grass?", answer: "green", options: ["green", "purple", "red"] },
    ],
    medium: [
      { question: "Which two colors can make green?", answer: "blue and yellow", options: ["blue and yellow", "red and blue", "orange and purple"] },
      { question: "Which color matches a banana?", answer: "yellow", options: ["yellow", "red", "green"] },
      { question: "Which object is usually orange?", answer: "carrot", options: ["carrot", "cloud", "grass"] },
      { question: "Which color feels calm like water?", answer: "blue", options: ["blue", "red", "black"] },
    ],
    hard: [
      { question: "If red and yellow are mixed, which color do we get?", answer: "orange", options: ["orange", "green", "purple"], challengeOption: "brown" },
      { question: "Which color is lighter: navy blue or sky blue?", answer: "sky blue", options: ["sky blue", "navy blue", "both are the same"], challengeOption: "red" },
      { question: "Which is a warm color?", answer: "red", options: ["red", "blue", "green"], challengeOption: "gray" },
      { question: "Which color can stand for stop signs?", answer: "red", options: ["red", "yellow", "purple"], challengeOption: "white" },
      { question: "Which color group has red, yellow, and orange?", answer: "warm colors", options: ["warm colors", "cool colors", "neutral colors"], challengeOption: "shape colors" },
    ],
  },
  "numbers-1": {
    easy: [
      { question: "What comes after 2?", answer: "3", options: ["1", "3", "5"] },
      { question: "How many thumbs are on two hands?", answer: "2", options: ["2", "4", "8"] },
      { question: "What number comes before 5?", answer: "4", options: ["3", "4", "6"] },
    ],
    medium: [
      { question: "What is 3 + 2?", answer: "5", options: ["4", "5", "6"] },
      { question: "What comes after 8?", answer: "9", options: ["7", "9", "10"] },
      { question: "How many fingers are on one hand?", answer: "5", options: ["4", "5", "10"] },
      { question: "Which number is bigger?", answer: "7", options: ["3", "7", "2"] },
    ],
    hard: [
      { question: "What is 10 - 3?", answer: "7", options: ["6", "7", "8"], challengeOption: "5" },
      { question: "Which number is even?", answer: "8", options: ["5", "7", "8"], challengeOption: "9" },
      { question: "What is 4 + 4?", answer: "8", options: ["6", "7", "8"], challengeOption: "9" },
      { question: "If you have 6 blocks and add 2 more, how many blocks?", answer: "8", options: ["7", "8", "9"], challengeOption: "10" },
      { question: "Which number is missing: 2, 4, 6, __, 10?", answer: "8", options: ["7", "8", "9"], challengeOption: "6" },
    ],
  },
  "letters-1": {
    easy: [
      { question: "What letter does Apple start with?", answer: "A", options: ["A", "B", "C"] },
      { question: "What letter does Ball start with?", answer: "B", options: ["A", "B", "D"] },
      { question: "What letter does Cat start with?", answer: "C", options: ["C", "E", "F"] },
    ],
    medium: [
      { question: "Which word starts with D?", answer: "Dog", options: ["Apple", "Cat", "Dog"] },
      { question: "Which letter comes after B?", answer: "C", options: ["A", "C", "D"] },
      { question: "Which word starts with F?", answer: "Fish", options: ["Fish", "Elephant", "Ball"] },
      { question: "Which letter comes before E?", answer: "D", options: ["C", "D", "F"] },
    ],
    hard: [
      { question: "Which pair is in alphabetical order?", answer: "A, B", options: ["A, B", "C, A", "F, D"], challengeOption: "E, C" },
      { question: "Which word has the beginning sound /b/?", answer: "Ball", options: ["Apple", "Ball", "Fish"], challengeOption: "Cat" },
      { question: "What letter is missing: A, B, __, D?", answer: "C", options: ["C", "E", "F"], challengeOption: "A" },
      { question: "Which word starts with the same sound as Cat?", answer: "Car", options: ["Dog", "Car", "Fish"], challengeOption: "Ball" },
      { question: "Which letter comes after E?", answer: "F", options: ["D", "F", "A"], challengeOption: "C" },
    ],
  },
  "shapes-1": {
    easy: [
      { question: "Which shape is round?", answer: "circle", options: ["circle", "square", "triangle"] },
      { question: "Which shape has 3 sides?", answer: "triangle", options: ["star", "triangle", "circle"] },
      { question: "Which shape has 4 equal sides?", answer: "square", options: ["square", "circle", "heart"] },
    ],
    medium: [
      { question: "What shape is a pizza slice?", answer: "triangle", options: ["triangle", "circle", "square"] },
      { question: "What shape is a wheel?", answer: "circle", options: ["circle", "star", "square"] },
      { question: "Which shape has points like the night sky?", answer: "star", options: ["heart", "star", "circle"] },
      { question: "Which shape can look like a window?", answer: "square", options: ["square", "circle", "triangle"] },
    ],
    hard: [
      { question: "A rectangle has how many sides?", answer: "4", options: ["3", "4", "5"], challengeOption: "6" },
      { question: "Which shape has no corners?", answer: "circle", options: ["triangle", "circle", "square"], challengeOption: "rectangle" },
      { question: "Which shape has more sides: triangle or square?", answer: "square", options: ["triangle", "square", "same"], challengeOption: "circle" },
      { question: "Which object is usually a rectangle?", answer: "door", options: ["door", "ball", "slice of pizza"], challengeOption: "star sticker" },
      { question: "Which shape is often used for love?", answer: "heart", options: ["heart", "square", "triangle"], challengeOption: "circle" },
    ],
  },
  "basics-1": {
    easy: [
      { question: "When you smile, how might you feel?", answer: "happy", options: ["happy", "sad", "angry"] },
      { question: "When you cry, how might you feel?", answer: "sad", options: ["excited", "sad", "calm"] },
      { question: "When your body feels quiet and safe, you may feel...", answer: "calm", options: ["calm", "angry", "surprised"] },
    ],
    medium: [
      { question: "When you get a gift, how might you feel?", answer: "happy", options: ["sad", "happy", "angry"] },
      { question: "When a loud noise happens, how might you feel?", answer: "surprised", options: ["surprised", "calm", "sleepy"] },
      { question: "What can help when you feel angry?", answer: "take slow breaths", options: ["take slow breaths", "shout louder", "throw toys"] },
      { question: "When you miss your friend, how might you feel?", answer: "sad", options: ["happy", "sad", "excited"] },
    ],
    hard: [
      { question: "What is a good first step when a task feels too hard?", answer: "ask for help", options: ["ask for help", "give up forever", "hide the task"], challengeOption: "skip all learning" },
      { question: "Which feeling can make your body feel full of energy?", answer: "excited", options: ["excited", "calm", "sleepy"], challengeOption: "bored" },
      { question: "If you feel frustrated, what can you say?", answer: "I need a break", options: ["I need a break", "I cannot learn", "go away"], challengeOption: "never mind" },
      { question: "Which is a coping strategy?", answer: "counting breaths", options: ["counting breaths", "covering the answer", "rushing"], challengeOption: "closing the app" },
      { question: "Which emotion might happen when plans change suddenly?", answer: "worried", options: ["worried", "hungry", "purple"], challengeOption: "square" },
    ],
  },
  "social-1": {
    easy: [
      { question: "What can you say when you meet someone?", answer: "hello", options: ["hello", "banana", "red"] },
      { question: "What can you say when you leave?", answer: "goodbye", options: ["goodbye", "please", "circle"] },
      { question: "What polite word can you use when asking?", answer: "please", options: ["please", "blue", "seven"] },
    ],
    medium: [
      { question: "What do you say when someone gives you something?", answer: "thank you", options: ["please", "thank you", "hello"] },
      { question: "What do you say when you want something?", answer: "please", options: ["hello", "please", "goodbye"] },
      { question: "What is one friendly greeting?", answer: "wave hello", options: ["wave hello", "turn away", "grab"] },
      { question: "What can you do if you do not want to talk?", answer: "use a wave or card", options: ["use a wave or card", "push someone", "run in circles"] },
    ],
    hard: [
      { question: "Someone says hello. What is a kind response?", answer: "say hello back", options: ["say hello back", "ignore every time", "take their toy"], challengeOption: "count to ten" },
      { question: "What can you say if you need space?", answer: "I need space, please", options: ["I need space, please", "go away now", "never talk"], challengeOption: "blue sky" },
      { question: "What should you do before joining a game?", answer: "ask to join", options: ["ask to join", "take over", "hide the game"], challengeOption: "say nothing always" },
      { question: "Which is polite after help?", answer: "thank you", options: ["thank you", "mine", "stop"], challengeOption: "triangle" },
      { question: "If someone is busy, what can you do?", answer: "wait or ask later", options: ["wait or ask later", "interrupt louder", "push in"], challengeOption: "forget manners" },
    ],
  },
};

const speak = (text) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

const supportActivities = {
  default: [
    { id: "color-hunt", label: "Color Hunt 🌈", prompt: "Find one red thing, one blue thing, and one green thing around you." },
    { id: "clap-count", label: "Clap & Count 👏", prompt: "Clap your hands five times and count each clap slowly." },
    { id: "animal-stretch", label: "Animal Stretch 🐻", prompt: "Do a big bear stretch and a tiny mouse stretch, then take a deep breath." },
  ],
  sad: [
    { id: "smile-memory", label: "Happy Memory 🌟", prompt: "Tell me one thing that made you smile this week." },
    { id: "heart-breath", label: "Heart Breathing ❤️", prompt: "Place your hand on your heart and take five slow breaths." },
    { id: "favorite-thing", label: "Favorite Thing 🎁", prompt: "Name your favorite color, animal, and game." },
  ],
  frustrated: [
    { id: "mini-win", label: "Mini Win ✅", prompt: "Let's do one super easy question to get momentum back." },
    { id: "count-breath", label: "Count Breaths 🌬️", prompt: "Breathe in for 1, 2, 3 and out for 1, 2, 3. Repeat three times." },
    { id: "movement-break", label: "Movement Break 🕺", prompt: "Shake your hands, stretch up high, and take a sip of water." },
  ],
  sleepy: [
    { id: "energy-shake", label: "Energy Shake ⚡", prompt: "Stand up, shake your arms and legs for ten seconds, then smile." },
    { id: "quick-jump", label: "Tiny Jumps 🦘", prompt: "Try five tiny jumps and count them out loud." },
    { id: "splash-focus", label: "Focus Reset 🚿", prompt: "Wash your face or drink water, then come back for one short question." },
  ],
};

const difficultyOrder = ["easy", "medium", "hard"];

const clampDifficulty = (level) =>
  difficultyOrder.includes(level) ? level : "medium";

const getDifficultyMultiplier = (level) => {
  if (level === "easy") return 0.85;
  if (level === "hard") return 1.2;
  return 1;
};

const inferDifficultyFromProfile = (userProgress, childId) => {
  const childStats = userProgress?.analytics?.childStats || [];
  const child = childStats.find((item) => item.childId === childId);

  if (!child) return "medium";

  if (child.accuracy >= 82 && !["sad", "unhappy", "frustrated", "sleepy"].includes(child.dominantEmotion)) {
    return "hard";
  }

  if (child.accuracy < 58 || ["sad", "unhappy", "frustrated", "sleepy"].includes(child.dominantEmotion)) {
    return "easy";
  }

  return "medium";
};

const buildAdaptiveQuiz = (lesson, level = "medium") => {
  const sourceQuiz = levelQuestionBank[lesson?.id]?.[level] || lesson?.quiz || [];

  return sourceQuiz.map((question) => {
    const base = Array.isArray(question.options) ? [...question.options] : [];
    const answer = question.answer;
    const uniqueOptions = [...new Set(base)];
    const wrongOptions = uniqueOptions.filter((option) => option !== answer);

    if (level === "easy") {
      const options = [answer, wrongOptions[0]].filter(Boolean);
      return {
        ...question,
        options,
        hint: "Take your time and try elimination.",
      };
    }

    if (level === "hard") {
      const challengeOption = question.challengeOption || "Not sure yet";
      const options = [...new Set([...uniqueOptions, challengeOption])];
      return {
        ...question,
        options,
        hint: "Try answering before using hints.",
      };
    }

    return {
      ...question,
      options: uniqueOptions,
      hint: question.hint || "You can do this. Read slowly and choose the best answer.",
    };
  });
};

const getSupportPrompt = (emotion) => {
  const emotionKey = negativeEmotions.has(emotion) ? emotion : "default";
  const label = emotionMeta[emotion]?.label?.toLowerCase() || "a hard moment";
  const emoji = emotionMeta[emotion]?.emoji || "💛";

  return {
    emotion,
    title: `Let's take a fun reset ${emoji}`,
    message: `I noticed you might be feeling ${label}. Try one quick activity, then we can continue.`,
    activities: supportActivities[emotionKey] || supportActivities.default,
  };
};

const Learning = ({ onCompleteLesson, onSaveSession, onUpdatePreferences, userProgress, childId }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeLesson, setActiveLesson] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [lessonStartTime, setLessonStartTime] = useState(null);
  const [emotionSamples, setEmotionSamples] = useState([]);
  const [supportPrompt, setSupportPrompt] = useState(null);
  const [sessionNotice, setSessionNotice] = useState("");
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [adaptiveLevel, setAdaptiveLevel] = useState("medium");

  const adaptiveQuiz = useMemo(
    () => (activeLesson ? buildAdaptiveQuiz(activeLesson, adaptiveLevel) : []),
    [activeLesson, adaptiveLevel]
  );

  const filteredLessons = useMemo(
    () => selectedCategory === "all" ? lessons : lessons.filter((lesson) => lesson.category === selectedCategory),
    [selectedCategory]
  );

  const handleStartLesson = (lesson) => {
    const inferredDifficulty = clampDifficulty(inferDifficultyFromProfile(userProgress, childId));
    setActiveLesson(lesson);
    setShowCamera(false);
    setQuizAnswers({});
    setEmotionSamples([]);
    setSupportPrompt(null);
    setSessionNotice("");
    setAdaptiveLevel(inferredDifficulty);
    setLessonStartTime(Date.now());
  };

  const handleEmotionSample = (emotion) => {
    setEmotionSamples((current) => {
      const next = [...current.slice(-59), emotion];
      const recent = next.slice(-3);
      const shouldPrompt = recent.length === 3 && recent.every((item) => negativeEmotions.has(item));

      if (shouldPrompt) {
        setSupportPrompt(getSupportPrompt(emotion));
        setAdaptiveLevel((current) => (current === "hard" ? "medium" : "easy"));
      } else if (!negativeEmotions.has(emotion)) {
        setSupportPrompt(null);
      }

      return next;
    });
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    if (!childId) {
      setSessionNotice("Please select a child profile in Progress before saving lesson data.");
      return;
    }

    const exercises = adaptiveQuiz.map((question, index) => ({
      exerciseId: `${activeLesson.id}-q${index + 1}`,
      correct: quizAnswers[index] === question.answer,
    }));
    const totalTime = lessonStartTime ? Math.max(1, Math.round((Date.now() - lessonStartTime) / 1000)) : 0;
    const correctCount = exercises.filter((item) => item.correct).length;
    const baseStars = activeLesson.stars;
    const awardedStars = Math.max(1, Math.round(baseStars * getDifficultyMultiplier(adaptiveLevel)));

    setIsSavingSession(true);
    try {
      await onSaveSession?.({
        childId,
        emotions: emotionSamples.length ? emotionSamples : ["neutral"],
        exercises,
        totalTime,
        meta: {
          lessonId: activeLesson.id,
          category: activeLesson.category,
          difficultyLevel: adaptiveLevel,
          quizCount: adaptiveQuiz.length,
        },
      });
      const lessonResult = await onCompleteLesson(activeLesson.id, awardedStars);
      const questBonus = lessonResult?.rewards?.questBonusStars || 0;
      const totalEarned = awardedStars + questBonus;
      setSessionNotice(
        `Great effort! You got ${correctCount}/${exercises.length} correct and earned ${totalEarned} stars${questBonus ? ` (${questBonus} quest bonus)` : ""}.`
      );
      setShowCamera(false);
      setSupportPrompt(null);
      setActiveLesson(null);
    } catch (err) {
      console.error(err);
      setSessionNotice("We could not save this lesson right now. Please try again.");
    } finally {
      setIsSavingSession(false);
    }
  };

  if (activeLesson) {
    const answeredCount = Object.keys(quizAnswers).length;
    const canComplete = answeredCount === adaptiveQuiz.length && !isSavingSession && Boolean(childId);
    const recommendedVideo = videoRecommendations[activeLesson.id];
    const completedVideos = userProgress.preferences?.completedVideos || [];
    const videoCompleted = completedVideos.includes(activeLesson.id);
    const markVideoComplete = () => {
      onUpdatePreferences?.({
        ...userProgress.preferences,
        completedVideos: [...new Set([...completedVideos, activeLesson.id])],
      });
      setSessionNotice("Video practice marked complete.");
    };

    return (
      <div className="learning-active">
        <CameraView
          isActive={showCamera}
          onClose={() => setShowCamera(false)}
          onEmotionChange={handleEmotionSample}
        />

        <button className="btn btn-outline" onClick={() => { setActiveLesson(null); setShowCamera(false); }}>
          Back to Lessons ←
        </button>

        {sessionNotice && <p className="dashboard-status success">{sessionNotice}</p>}

        <section className="learning-hero">
          <div>
            <h1>{activeLesson.title} {activeLesson.icon}</h1>
            <p>{activeLesson.description}</p>
            <div className="learning-meta">
              <span>⏱️ {activeLesson.duration}</span>
              <span>⭐ {Math.max(1, Math.round(activeLesson.stars * getDifficultyMultiplier(adaptiveLevel)))} Stars</span>
              <span>Level: {adaptiveLevel.toUpperCase()}</span>
            </div>
          </div>
          <div className="learning-hero-actions">
            <button className="btn btn-outline" onClick={() => speak(`${activeLesson.title}. ${activeLesson.description}`)}>
              Read Aloud 🔊
            </button>
            <button className={`btn ${showCamera ? "btn-primary" : "btn-outline"}`} onClick={() => setShowCamera((value) => !value)}>
              {showCamera ? "Camera On 📷" : "Camera Off 📷"}
            </button>
          </div>
        </section>

        {supportPrompt && (
          <section className="learning-panel learning-support-panel">
            <h2>{supportPrompt.title}</h2>
            <p>{supportPrompt.message}</p>
            <div className="learning-support-actions">
              {supportPrompt.activities.map((activity) => (
                <button
                  key={activity.id}
                  className="btn btn-small btn-outline"
                  onClick={() => speak(activity.prompt)}
                  type="button"
                >
                  {activity.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="learning-panel">
          <h2>Let's Learn 📖</h2>
          <div className="learning-items-grid">
            {activeLesson.items.map((item) => (
              <button key={item.name} className="learning-item" onClick={() => speak(item.name)}>
                <span>{item.emoji}</span>
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        </section>

        {recommendedVideo && (
          <section className="learning-panel learning-video-panel">
            <div>
              <h2>Recommended YouTube Practice</h2>
              <p>{recommendedVideo.title} by {recommendedVideo.source}</p>
              <small>{videoCompleted ? "Completed with caregiver review" : "Review the video before independent viewing."}</small>
            </div>
            <div className="learning-video-actions">
              <a className="btn btn-outline" href={recommendedVideo.url} target="_blank" rel="noreferrer">
                Open Video
              </a>
              <button className="btn btn-secondary" type="button" onClick={markVideoComplete} disabled={videoCompleted}>
                {videoCompleted ? "Video Complete" : "Mark Complete"}
              </button>
            </div>
          </section>
        )}

        <section className="learning-panel quiz-panel">
          <h2>{adaptiveLevel.toUpperCase()} Level Quiz ({adaptiveQuiz.length} questions)</h2>
          {adaptiveQuiz.map((question, index) => (
            <div className="quiz-question" key={question.question}>
              <div className="quiz-question-header">
                <p>{question.question}</p>
                <button className="btn btn-small btn-outline" onClick={() => speak(question.question)}>
                  🔊
                </button>
              </div>
              <small>{question.hint}</small>
              <div className="quiz-options">
                {question.options.map((option) => {
                  const selected = quizAnswers[index] === option;
                  const correct = option === question.answer;
                  return (
                    <button
                      key={option}
                      className={`btn btn-small ${selected ? (correct ? "btn-secondary" : "btn-primary") : "btn-outline"}`}
                      onClick={() => setQuizAnswers((current) => ({ ...current, [index]: option }))}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[index] && (
                <p className={quizAnswers[index] === question.answer ? "quiz-feedback correct" : "quiz-feedback incorrect"}>
                  {quizAnswers[index] === question.answer ? "Correct! 🎉" : `Good try. The answer is ${question.answer}.`}
                </p>
              )}
            </div>
          ))}
        </section>

        <button className="btn btn-secondary btn-large" onClick={handleCompleteLesson} disabled={!canComplete}>
          {isSavingSession
            ? "Saving lesson... ⏳"
            : !childId
              ? "Select child profile in Progress first"
              : canComplete
                ? `Complete Lesson & Earn ${Math.max(1, Math.round(activeLesson.stars * getDifficultyMultiplier(adaptiveLevel)))} Stars! ⭐`
                : "Answer the quiz to complete ✅"}
        </button>
      </div>
    );
  }

  return (
    <div className="learning">
      {sessionNotice && <p className="dashboard-status success">{sessionNotice}</p>}
      <header className="page-header">
        <h1 className="page-title">Personalized Learning Engine 📚</h1>
        <p className="page-subtitle">Choose a topic. AI-Tutor adapts the quiz level and adds video practice support.</p>
      </header>

      <section className="learning-category-bar">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn ${selectedCategory === category.id ? "btn-primary" : "btn-outline"}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </section>

      <section className="lesson-grid">
        {filteredLessons.map((lesson) => {
          const isCompleted = userProgress.completedLessons.includes(lesson.id);
          return (
            <button key={lesson.id} className={`lesson-card ${isCompleted ? "completed" : ""}`} onClick={() => handleStartLesson(lesson)}>
              {isCompleted && <span className="lesson-complete-badge">✓</span>}
              <span className="lesson-icon">{lesson.icon}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <div className="lesson-progress">
                <span>⏱️ {lesson.duration}</span>
                <span>⭐ {lesson.stars}</span>
                {videoRecommendations[lesson.id] && <span>Video guide</span>}
                {userProgress.preferences?.completedVideos?.includes(lesson.id) && <span>Watched</span>}
              </div>
            </button>
          );
        })}
      </section>

      <section className="learning-progress-card">
        <span>📊</span>
        <div>
          <h3>Your Learning Progress</h3>
          <p>{userProgress.completedLessons.length} of {lessons.length} lessons completed</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(userProgress.completedLessons.length / lessons.length) * 100}%` }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learning;
