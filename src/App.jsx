import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Learning from "./pages/Learning";
import Rewards from "./pages/Rewards";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import {
  createChild,
  getChildren,
  getCurrentUser,
  logoutUser,
  saveSession,
  saveCompletedLesson,
  updateChild,
  updateProgress as updateProgressApi,
} from "./api/api";
import "./styles/main.css";

const defaultProgress = {
  totalStars: 0,
  completedLessons: [],
  currentStreak: 0,
  lastActiveDate: null,
  achievements: [],
  redeemedRewards: [],
  analytics: {
    totalSessions: 0,
    totalPracticeTime: 0,
    totalExercises: 0,
    correctAnswers: 0,
    accuracy: 0,
    emotionTotals: {},
    hourlySessions: Array(24).fill(0),
    dailyStats: [],
    childStats: [],
  },
  gamification: {
    questDateKey: "",
    dailyQuests: [],
    streakShields: 1,
    calmComebacks: 0,
    totalQuestBonuses: 0,
  },
  preferences: {
    fontSize: "medium",
    animations: true,
    soundEffects: true,
    theme: "calm-blue",
    autoReadLessons: false,
    repeatQuizQuestions: true,
    showHints: true,
    dailyTimeLimit: "2-hours",
    requireBreak: true,
    progressReports: true,
    anonymousAnalytics: false,
    parentPin: "1234",
    completedVideos: [],
    teacherGoals: [],
  },
};

const mergeProgress = (progress = {}) => ({
  ...defaultProgress,
  ...progress,
  analytics: {
    ...defaultProgress.analytics,
    ...(progress.analytics || {}),
    hourlySessions: Array.isArray(progress.analytics?.hourlySessions)
      ? [...progress.analytics.hourlySessions]
      : [...defaultProgress.analytics.hourlySessions],
  },
  gamification: {
    ...defaultProgress.gamification,
    ...(progress.gamification || {}),
  },
  preferences: {
    ...defaultProgress.preferences,
    ...(progress.preferences || {}),
  },
});

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [token, setToken] = useState(() => localStorage.getItem("aiTutorToken"));
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(defaultProgress);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(token));
  const [appError, setAppError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        const childData = await getChildren(token);
        setUser(data.user);
        setUserProgress(mergeProgress(data.progress));
        setChildren(childData.children || []);
        setSelectedChildId(childData.children?.[0]?.id || "");
      } catch (err) {
        console.error(err);
        localStorage.removeItem("aiTutorToken");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem("aiTutorToken", data.token);
    setToken(data.token);
    setUser(data.user);
    setUserProgress(mergeProgress(data.progress));
    setCurrentView("home");
    getChildren(data.token).then((childData) => {
      setChildren(childData.children || []);
      setSelectedChildId(childData.children?.[0]?.id || "");
    }).catch((err) => {
      console.error(err);
      setAppError(err.message);
    });
  };

  const persistProgress = async (updates) => {
    if (!token) return;

    try {
      const data = await updateProgressApi(token, updates);
      setUserProgress(mergeProgress(data.progress));
    } catch (err) {
      console.error(err);
      setAppError(err.message);
    }
  };

  const completeLesson = async (lessonId, stars) => {
    if (!token) return;

    try {
      const data = await saveCompletedLesson(token, lessonId, stars);
      setUserProgress(mergeProgress(data.progress));
      return data;
    } catch (err) {
      console.error(err);
      setAppError(err.message);
      throw err;
    }
  };

  const saveLessonSession = async (sessionData) => {
    if (!token) return;

    try {
      return await saveSession(token, sessionData);
    } catch (err) {
      console.error(err);
      setAppError(err.message);
      throw err;
    }
  };

  const addChildProfile = async (child) => {
    if (!token) return;

    try {
      const data = await createChild(token, child);
      setChildren((current) => [...current, data.child]);
      setSelectedChildId(data.child.id);
    } catch (err) {
      console.error(err);
      setAppError(err.message);
    }
  };

  const editChildProfile = async (childId, child) => {
    if (!token) return;

    try {
      const data = await updateChild(token, childId, child);
      setChildren((current) => current.map((item) => (item.id === childId ? data.child : item)));
    } catch (err) {
      console.error(err);
      setAppError(err.message);
    }
  };

  const updatePreferences = (preferences) => {
    setUserProgress((current) => ({
      ...current,
      preferences,
    }));
    persistProgress({ preferences });
  };

  const redeemReward = (rewardId) => {
    const redeemedRewards = [...new Set([...userProgress.redeemedRewards, String(rewardId)])];
    persistProgress({ redeemedRewards });
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("aiTutorToken");
      setToken(null);
      setUser(null);
      setUserProgress(defaultProgress);
      setChildren([]);
      setSelectedChildId("");
      setCurrentView("home");
    }
  };

  if (isLoadingUser) {
    return <div className="app-loading">Loading your learning space...</div>;
  }

  if (!user || !token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div
        className={`app theme-${userProgress.preferences.theme || "calm-blue"} font-${userProgress.preferences.fontSize || "medium"} ${userProgress.preferences.animations ? "" : "reduce-app-motion"}`}
      >
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          totalStars={userProgress.totalStars}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          {appError && (
            <p className="dashboard-status error" role="alert">
              {appError}
            </p>
          )}

          {currentView === "home" && <Home onNavigate={setCurrentView} />}
          {currentView === "chat" && (
            <Chat
              userProgress={userProgress}
              authToken={token}
              children={children}
              selectedChildId={selectedChildId}
            />
          )}
          {currentView === "learning" && (
            <Learning
              onCompleteLesson={completeLesson}
              onSaveSession={saveLessonSession}
              onUpdatePreferences={updatePreferences}
              childId={selectedChildId}
              userProgress={userProgress}
            />
          )}
          {currentView === "rewards" && (
            <Rewards
              totalStars={userProgress.totalStars}
              redeemedRewards={userProgress.redeemedRewards}
              gamification={userProgress.gamification}
              onRedeemReward={redeemReward}
            />
          )}
          {currentView === "dashboard" && (
            <Dashboard
              userProgress={userProgress}
              authToken={token}
              children={children}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
              onAddChild={addChildProfile}
              onUpdateChild={editChildProfile}
              onUpdatePreferences={updatePreferences}
            />
          )}
          {currentView === "settings" && (
            <Settings
              preferences={userProgress.preferences}
              onUpdatePreferences={updatePreferences}
            />
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
