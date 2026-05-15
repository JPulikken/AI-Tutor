export const curatedVideos = {
  "colors-1": {
    title: "Color Learning Playlist",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=learn+colors+for+kids+calm+educational+video",
  },
  "numbers-1": {
    title: "Counting 1 to 10 Practice",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=counting+1+to+10+for+kids+calm+educational+video",
  },
  "letters-1": {
    title: "ABC Letter Sounds Practice",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=abc+letters+phonics+for+kids+calm+educational+video",
  },
  "shapes-1": {
    title: "Shape Recognition Practice",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=learn+shapes+for+kids+calm+educational+video",
  },
  "basics-1": {
    title: "Feelings and Emotions Practice",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=emotions+and+feelings+for+kids+calm+educational+video",
  },
  "social-1": {
    title: "Greeting and Social Skills Practice",
    provider: "YouTube Kids-friendly search",
    reviewStatus: "Caregiver review recommended",
    url: "https://www.youtube.com/results?search_query=saying+hello+social+skills+for+kids+calm+educational+video",
  },
};

export const levelQuestionBank = {
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
};

const fallbackQuestions = {
  easy: [
    { question: "Which answer matches the lesson?", answer: "practice", options: ["practice", "skip", "rush"] },
    { question: "What should we do when learning feels hard?", answer: "try slowly", options: ["try slowly", "quit", "guess fast"] },
    { question: "Who can help when you need support?", answer: "a trusted adult", options: ["a trusted adult", "no one", "a timer"] },
  ],
  medium: [
    { question: "What helps learning feel calm?", answer: "short practice", options: ["short practice", "rushing", "too much noise"] },
    { question: "What can you do after a mistake?", answer: "try again", options: ["try again", "stop forever", "hide"] },
    { question: "Which is a good learning habit?", answer: "take breaks", options: ["take breaks", "ignore feelings", "rush"] },
    { question: "What makes a lesson personal?", answer: "matching the child's level", options: ["matching the child's level", "same work every time", "no feedback"] },
  ],
  hard: [
    { question: "Why does AI-Tutor change quiz levels?", answer: "to match readiness", options: ["to match readiness", "to punish mistakes", "to make it random"], challengeOption: "to remove lessons" },
    { question: "What should happen after repeated frustration?", answer: "offer a reset", options: ["offer a reset", "increase pressure", "hide hints"], challengeOption: "end all learning" },
    { question: "Which data helps personalize practice?", answer: "accuracy and emotion trends", options: ["accuracy and emotion trends", "shoe size", "screen brightness"], challengeOption: "random colors" },
    { question: "What is a good caregiver role?", answer: "review and guide", options: ["review and guide", "ignore progress", "remove breaks"], challengeOption: "guess goals" },
    { question: "What makes a topic ready for challenge?", answer: "strong accuracy and calm engagement", options: ["strong accuracy and calm engagement", "fatigue", "missed practice"], challengeOption: "noise level only" },
  ],
};

export const getTopicQuestions = (lessonId, level = "medium") =>
  levelQuestionBank[lessonId]?.[level] || fallbackQuestions[level] || fallbackQuestions.medium;

export const buildAdaptiveQuiz = (lesson, level = "medium") => {
  const sourceQuiz = getTopicQuestions(lesson?.id, level);

  return sourceQuiz.map((question) => {
    const base = Array.isArray(question.options) ? [...question.options] : [];
    const answer = question.answer;
    const uniqueOptions = [...new Set(base)];
    const wrongOptions = uniqueOptions.filter((option) => option !== answer);

    if (level === "easy") {
      return {
        ...question,
        options: [answer, wrongOptions[0]].filter(Boolean),
        hint: "Take your time and try elimination.",
      };
    }

    if (level === "hard") {
      return {
        ...question,
        options: [...new Set([...uniqueOptions, question.challengeOption || "Not sure yet"])],
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

export const getRecommendedVideo = (lessonId) => curatedVideos[lessonId] || null;
