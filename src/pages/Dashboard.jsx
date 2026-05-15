import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getNotifications,
  getReport,
  getWeeklyDigest,
  markAllNotificationsRead,
  markNotificationRead,
  saveSession,
} from "../api/api";
import EmotionCamera from "../components/EmotionCamera";
import { emotionMeta } from "../utils/emotionMapping";

const emptyChildForm = {
  name: "",
  age: 8,
  avatar: "😊",
};

const Dashboard = ({
  userProgress,
  authToken,
  children: childProfiles = [],
  selectedChildId,
  onSelectChild,
  onAddChild,
  onUpdateChild,
  onUpdatePreferences,
}) => {
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [report, setReport] = useState("");
  const [reportMetrics, setReportMetrics] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isLoadingDigest, setIsLoadingDigest] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showEmotionCamera, setShowEmotionCamera] = useState(false);
  const [emotionSamples, setEmotionSamples] = useState([]);
  const [weeklyDigest, setWeeklyDigest] = useState("");
  const [weeklyMetrics, setWeeklyMetrics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [childForm, setChildForm] = useState(emptyChildForm);
  const [editingChildId, setEditingChildId] = useState("");
  const [goalForm, setGoalForm] = useState({
    title: "",
    topic: "colors",
    targetLevel: "medium",
    notes: "",
  });

  const selectedChild = useMemo(
    () => childProfiles.find((child) => child.id === selectedChildId) || childProfiles[0],
    [childProfiles, selectedChildId]
  );

  const activeChildId = selectedChild?.id || selectedChildId;
  const analytics = userProgress?.analytics || {};
  const gamification = userProgress?.gamification || {};
  const childAnalytics = (analytics.childStats || []).find((item) => item.childId === activeChildId);
  const bestLearningHour = Array.isArray(analytics.hourlySessions)
    ? analytics.hourlySessions.reduce(
      (best, value, hour) => (value > best.sessions ? { hour, sessions: value } : best),
      { hour: 0, sessions: 0 }
    )
    : { hour: 0, sessions: 0 };

  const handleEmotionChange = useCallback((emotion) => {
    setCurrentEmotion(emotion);
    setEmotionSamples((current) => [...current.slice(-59), emotion]);
  }, []);

  const fetchReport = useCallback(async () => {
    if (!activeChildId) return;

    setIsLoadingReport(true);
    setError("");

    try {
      const res = await getReport(authToken, activeChildId, selectedChild?.name);
      setReport(res.report || "No report is available yet.");
      setReportMetrics(res.metrics || null);
    } catch (err) {
      console.error(err);
      setError("Could not fetch the report");
    } finally {
      setIsLoadingReport(false);
    }
  }, [activeChildId, authToken, selectedChild?.name]);

  const fetchNotifications = useCallback(async () => {
    if (!authToken) return;
    setIsLoadingNotifications(true);

    try {
      const data = await getNotifications(authToken, {
        childId: activeChildId,
        limit: 20,
      });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [activeChildId, authToken]);

  const fetchWeeklyDigest = useCallback(async () => {
    if (!activeChildId) return;

    setIsLoadingDigest(true);
    setError("");

    try {
      const data = await getWeeklyDigest(authToken, activeChildId, selectedChild?.name);
      setWeeklyDigest(data.digest || "No weekly digest data yet.");
      setWeeklyMetrics(data.metrics || null);
      setMessage("Weekly digest updated");
      fetchNotifications();
    } catch (err) {
      console.error(err);
      setError("Could not generate weekly digest");
    } finally {
      setIsLoadingDigest(false);
    }
  }, [activeChildId, authToken, selectedChild?.name, fetchNotifications]);

  useEffect(() => {
    fetchReport();
    fetchNotifications();
  }, [fetchReport, fetchNotifications]);

  const handleSessionEnd = async () => {
    if (!activeChildId) return;

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await saveSession(authToken, {
        childId: activeChildId,
        emotions: emotionSamples.length ? emotionSamples : [currentEmotion],
        exercises: [],
        totalTime: 120,
      });
      setMessage(res.message || "Emotion check-in saved");
      setEmotionSamples([]);
      fetchReport();
    } catch (err) {
      console.error(err);
      setError("Could not save the emotion check-in");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadReport = async (format = "txt") => {
    if (!report) return;

    const safeChildName = (selectedChild?.name || "child")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const dateTag = new Date().toISOString().slice(0, 10);
    const filenameBase = `${safeChildName || "child"}-report-${dateTag}`;
    const reportPayload = {
      generatedAt: new Date().toISOString(),
      child: selectedChild || null,
      metrics: reportMetrics || null,
      report,
    };

    if (format === "pdf") {
      setIsDownloadingPdf(true);

      try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        let y = 40;

        doc.setFontSize(16);
        doc.text(`Progress Report${selectedChild?.name ? ` - ${selectedChild.name}` : ""}`, 40, y);
        y += 24;

        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 40, y);
        y += 18;

        if (reportMetrics) {
          const lines = [
            `Sessions: ${reportMetrics.totalSessions}`,
            `Accuracy: ${reportMetrics.accuracy}%`,
            `Recent Accuracy: ${reportMetrics.recentAccuracy}%`,
            `Dominant Emotion: ${reportMetrics.dominantEmotion}`,
          ];
          lines.forEach((line) => {
            doc.text(line, 40, y);
            y += 16;
          });

          y += 8;
          doc.text("Emotion Mix", 40, y);
          y += 16;
          (reportMetrics.emotionBreakdown || []).filter((item) => item.count > 0).slice(0, 6).forEach((item) => {
            doc.text(`${item.emotion}: ${item.percent}%`, 48, y);
            doc.setFillColor(91, 155, 213);
            doc.rect(180, y - 10, Math.max(4, item.percent * 2), 8, "F");
            y += 14;
          });
        }

        y += 10;
        doc.text("Narrative Report", 40, y);
        y += 14;
        const reportLines = doc.splitTextToSize(report, 520);
        doc.text(reportLines, 40, y);
        doc.save(`${filenameBase}.pdf`);
        setMessage(`Downloaded ${filenameBase}.pdf`);
      } catch (err) {
        console.error(err);
        setError("Could not generate PDF. Make sure PDF dependencies are installed.");
      } finally {
        setIsDownloadingPdf(false);
      }

      return;
    }

    const blob =
      format === "json"
        ? new Blob([JSON.stringify(reportPayload, null, 2)], { type: "application/json;charset=utf-8" })
        : new Blob([report], { type: "text/plain;charset=utf-8" });
    const fileName = format === "json" ? `${filenameBase}.json` : `${filenameBase}.txt`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setMessage(`Downloaded ${fileName}`);
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await markNotificationRead(authToken, notificationId);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllNotificationsRead(authToken, activeChildId);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditChild = (child) => {
    setEditingChildId(child.id);
    setChildForm({
      name: child.name,
      age: child.age,
      avatar: child.avatar || "😊",
    });
  };

  const handleChildSubmit = async (event) => {
    event.preventDefault();

    if (editingChildId) {
      await onUpdateChild(editingChildId, childForm);
    } else {
      await onAddChild(childForm);
    }

    setEditingChildId("");
    setChildForm(emptyChildForm);
  };

  const teacherGoals = userProgress.preferences?.teacherGoals || [];

  const saveTeacherGoals = (nextGoals) => {
    onUpdatePreferences?.({
      ...userProgress.preferences,
      teacherGoals: nextGoals,
    });
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    if (!goalForm.title.trim()) return;

    saveTeacherGoals([
      ...teacherGoals,
      {
        ...goalForm,
        id: `goal-${Date.now()}`,
        title: goalForm.title.trim(),
        notes: goalForm.notes.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setGoalForm({
      title: "",
      topic: "colors",
      targetLevel: "medium",
      notes: "",
    });
  };

  const toggleTeacherGoal = (goalId) => {
    saveTeacherGoals(
      teacherGoals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1 className="page-title">AI-Tutor Progress Dashboard 📊</h1>
        <p className="page-subtitle">Track personalized learning, ASD-friendly support signals, reports, and mood check-ins.</p>
      </header>

      <section className="dashboard-panel">
        <div className="dashboard-section-header">
          <div>
            <h2>Child Profiles 👧</h2>
            <p>Select, add, or edit a learner profile.</p>
          </div>
        </div>

        <div className="child-profile-grid">
          {childProfiles.map((child) => (
            <button
              key={child.id}
              className={`child-profile-card ${child.id === activeChildId ? "active" : ""}`}
              onClick={() => onSelectChild(child.id)}
            >
              <span>{child.avatar || "😊"}</span>
              <strong>{child.name}</strong>
              <small>Age {child.age}</small>
              <em onClick={(event) => { event.stopPropagation(); startEditChild(child); }}>
                Edit
              </em>
            </button>
          ))}
        </div>

        <form className="child-profile-form" onSubmit={handleChildSubmit}>
          <input
            value={childForm.avatar}
            onChange={(event) => setChildForm((current) => ({ ...current, avatar: event.target.value }))}
            aria-label="Avatar emoji"
            maxLength={4}
          />
          <input
            value={childForm.name}
            onChange={(event) => setChildForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Child name"
            required
          />
          <input
            type="number"
            min="1"
            max="18"
            value={childForm.age}
            onChange={(event) => setChildForm((current) => ({ ...current, age: event.target.value }))}
            aria-label="Age"
          />
          <button className="btn btn-primary" type="submit">
            {editingChildId ? "Save Child ✨" : "Add Child ➕"}
          </button>
          {editingChildId && (
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setEditingChildId("");
                setChildForm(emptyChildForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-section-header">
          <div>
            <h2>Teacher / Therapist Goals</h2>
            <p>Assign focused targets that guide lessons and caregiver review.</p>
          </div>
        </div>

        <form className="teacher-goal-form" onSubmit={handleGoalSubmit}>
          <input
            value={goalForm.title}
            onChange={(event) => setGoalForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Goal, e.g. identify 5 colors"
            required
          />
          <select
            value={goalForm.topic}
            onChange={(event) => setGoalForm((current) => ({ ...current, topic: event.target.value }))}
          >
            <option value="colors">Colors</option>
            <option value="numbers">Numbers</option>
            <option value="letters">Letters</option>
            <option value="shapes">Shapes</option>
            <option value="emotions">Emotions</option>
            <option value="social">Social skills</option>
          </select>
          <select
            value={goalForm.targetLevel}
            onChange={(event) => setGoalForm((current) => ({ ...current, targetLevel: event.target.value }))}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            value={goalForm.notes}
            onChange={(event) => setGoalForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Notes"
          />
          <button className="btn btn-primary" type="submit">
            Add Goal
          </button>
        </form>

        <div className="teacher-goal-list">
          {teacherGoals.length ? (
            teacherGoals.map((goal) => (
              <div className={`teacher-goal-item ${goal.completed ? "completed" : ""}`} key={goal.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(goal.completed)}
                    onChange={() => toggleTeacherGoal(goal.id)}
                  />
                  <span>
                    <strong>{goal.title}</strong>
                    <small>{goal.topic} | {goal.targetLevel}{goal.notes ? ` | ${goal.notes}` : ""}</small>
                  </span>
                </label>
              </div>
            ))
          ) : (
            <p className="camera-privacy-note">No assigned goals yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-panel dashboard-camera-panel">
        <div className="dashboard-section-header">
          <div>
            <h2>Emotion Detection 😊</h2>
            <p>Camera is used only while this panel is switched on.</p>
          </div>
          <button
            className={`btn ${showEmotionCamera ? "btn-primary" : "btn-outline"}`}
            type="button"
            onClick={() => setShowEmotionCamera((value) => !value)}
          >
            {showEmotionCamera ? "Stop Camera 🔒" : "Start Camera 📷"}
          </button>
        </div>
        {showEmotionCamera ? (
          <EmotionCamera onEmotionChange={handleEmotionChange} />
        ) : (
          <p className="camera-privacy-note">Camera is off. Start it when you want to save a mood check-in.</p>
        )}
        <p className="camera-privacy-note">
          Latest mood: {emotionMeta[currentEmotion]?.emoji || "😐"} {emotionMeta[currentEmotion]?.label || "Neutral"}.
          {" "}
          Collected samples: {emotionSamples.length}
        </p>
      </section>

      <section className="dashboard-stats" aria-label="Learning stats">
        <div className="dashboard-stat">
          <span className="dashboard-stat-value">{userProgress.totalStars}</span>
          <span className="dashboard-stat-label">Stars ⭐</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-value">{userProgress.completedLessons.length}</span>
          <span className="dashboard-stat-label">Lessons 📚</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-value">{userProgress.currentStreak}</span>
          <span className="dashboard-stat-label">Day streak 🔥</span>
        </div>
      </section>

      <section className="dashboard-actions">
        <button className="btn btn-secondary" type="button" onClick={handleSessionEnd} disabled={isSaving || !activeChildId}>
          {isSaving ? "Saving... ⏳" : "Save Emotion Check-in 😊"}
        </button>

        <button className="btn btn-primary" type="button" onClick={fetchReport} disabled={isLoadingReport || !activeChildId}>
          {isLoadingReport ? "Loading... ⏳" : "Refresh Report 📋"}
        </button>

        <button className="btn btn-secondary" type="button" onClick={fetchWeeklyDigest} disabled={isLoadingDigest || !activeChildId}>
          {isLoadingDigest ? "Generating..." : "Weekly Digest 🗓️"}
        </button>

        <button className="btn btn-outline" type="button" onClick={() => downloadReport("txt")} disabled={!report}>
          Download Report TXT ⬇️
        </button>

        <button className="btn btn-outline" type="button" onClick={() => downloadReport("json")} disabled={!report}>
          Download Report JSON ⬇️
        </button>

        <button className="btn btn-outline" type="button" onClick={() => downloadReport("pdf")} disabled={!report || isDownloadingPdf}>
          {isDownloadingPdf ? "Building PDF..." : "Download Report PDF ⬇️"}
        </button>
      </section>

      {(message || error) && (
        <p className={`dashboard-status ${error ? "error" : "success"}`}>
          {error || message}
        </p>
      )}

      <section className="dashboard-panel">
        <div className="dashboard-section-header">
          <div>
            <h2>Notifications 🔔</h2>
            <p>Instant parent alerts and reward updates.</p>
          </div>
          <button className="btn btn-small btn-outline" type="button" onClick={handleMarkAllNotificationsRead} disabled={!unreadCount}>
            Mark All Read
          </button>
        </div>

        <p className="camera-privacy-note">
          Unread alerts: {unreadCount} {isLoadingNotifications ? "(updating...)" : ""}
        </p>

        <div className="dashboard-notification-list">
          {notifications.length ? (
            notifications.map((item) => (
              <div key={item.id} className={`dashboard-notification-item ${item.severity}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </div>
                {!item.isRead && (
                  <button className="btn btn-small btn-outline" type="button" onClick={() => handleMarkNotificationRead(item.id)}>
                    Mark Read
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="camera-privacy-note">No notifications yet.</p>
          )}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2>Analytics Trends 📈</h2>
        <div className="dashboard-report-metrics">
          <div>
            <span>{analytics.totalSessions || 0}</span>
            <small>Total sessions</small>
          </div>
          <div>
            <span>{analytics.accuracy || 0}%</span>
            <small>Global accuracy</small>
          </div>
          <div>
            <span>{Math.round((analytics.totalPracticeTime || 0) / 60)}</span>
            <small>Minutes practiced</small>
          </div>
          <div>
            <span>{bestLearningHour.sessions ? `${String(bestLearningHour.hour).padStart(2, "0")}:00` : "--"}</span>
            <small>Best learning hour</small>
          </div>
        </div>

        {childAnalytics && (
          <p className="camera-privacy-note">
            Child trend: {childAnalytics.sessions} sessions, {childAnalytics.accuracy}% accuracy, dominant mood {childAnalytics.dominantEmotion}.
          </p>
        )}

        {Array.isArray(gamification.dailyQuests) && gamification.dailyQuests.length > 0 && (
          <div className="dashboard-chart-card">
            <h3>Daily Quests 🎯</h3>
            {gamification.dailyQuests.map((quest) => (
              <div className="dashboard-emotion-row" key={quest.id}>
                <span>{quest.label}</span>
                <div className="dashboard-bar">
                  <span style={{ width: `${Math.min(100, Math.round(((quest.progress || 0) / (quest.target || 1)) * 100))}%` }} />
                </div>
                <small>{quest.completed ? "Done" : `${quest.progress || 0}/${quest.target || 0}`}</small>
              </div>
            ))}
            <small>Streak shields: {gamification.streakShields || 0} | Calm comebacks: {gamification.calmComebacks || 0}</small>
          </div>
        )}

        <div className="dashboard-chart-card">
          <h3>Last 7-21 Days Accuracy</h3>
          {(analytics.dailyStats || []).slice(-14).map((item) => (
            <div className="dashboard-emotion-row" key={item.dateKey}>
              <span>{item.dateKey.slice(5)}</span>
              <div className="dashboard-bar">
                <span style={{ width: `${item.accuracy}%` }} />
              </div>
              <small>{item.accuracy}%</small>
            </div>
          ))}
          {!analytics.dailyStats?.length && <small>No trend data yet.</small>}
        </div>
      </section>

      {weeklyDigest && (
        <section className="dashboard-report">
          <h2>Weekly Parent Digest 🗓️</h2>
          {weeklyMetrics && (
            <div className="dashboard-report-metrics">
              <div>
                <span>{weeklyMetrics.sessions}</span>
                <small>Sessions this week</small>
              </div>
              <div>
                <span>{weeklyMetrics.accuracy}%</span>
                <small>Weekly accuracy</small>
              </div>
              <div>
                <span>{weeklyMetrics.dominantEmotion || "neutral"}</span>
                <small>Dominant emotion</small>
              </div>
            </div>
          )}
          <pre>{weeklyDigest}</pre>
        </section>
      )}

      {report && (
        <section className="dashboard-report">
          <h2>Child Report 📋</h2>
          {reportMetrics && (
            <>
              <div className="dashboard-report-metrics" aria-label="Report summary">
                <div>
                  <span>{reportMetrics.totalSessions}</span>
                  <small>Sessions 🧩</small>
                </div>
                <div>
                  <span>{reportMetrics.accuracy}%</span>
                  <small>Overall accuracy 🎯</small>
                </div>
                <div>
                  <span>{reportMetrics.recentAccuracy}%</span>
                  <small>Recent accuracy 📈</small>
                </div>
                <div>
                  <span>
                    {emotionMeta[reportMetrics.dominantEmotion]?.emoji || "😐"}{" "}
                    {emotionMeta[reportMetrics.dominantEmotion]?.label || reportMetrics.dominantEmotion}
                  </span>
                  <small>Main emotion 😊</small>
                </div>
              </div>

              {Array.isArray(reportMetrics.alerts) && reportMetrics.alerts.length > 0 && (
                <div className="dashboard-alert-panel" role="alert">
                  <h3>Parent Alerts 🚨</h3>
                  <ul>
                    {reportMetrics.alerts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="dashboard-chart-grid">
                <div className="dashboard-chart-card">
                  <h3>Accuracy 🎯</h3>
                  <div className="dashboard-bar">
                    <span style={{ width: `${reportMetrics.accuracy}%` }} />
                  </div>
                  <small>{reportMetrics.accuracy}% overall</small>
                </div>

                <div className="dashboard-chart-card">
                  <h3>Emotion Mix 🌈</h3>
                  {(reportMetrics.emotionBreakdown || []).filter((item) => item.count > 0).map((item) => (
                    <div className="dashboard-emotion-row" key={item.emotion}>
                      <span>
                        {emotionMeta[item.emotion]?.emoji || "😐"} {emotionMeta[item.emotion]?.label || item.emotion}
                      </span>
                      <div className="dashboard-bar">
                        <span style={{ width: `${item.percent}%` }} />
                      </div>
                      <small>{item.percent}%</small>
                    </div>
                  ))}
                  {(!reportMetrics.emotionBreakdown || !reportMetrics.emotionBreakdown.some((item) => item.count > 0)) && (
                    <small>No emotion samples recorded yet.</small>
                  )}
                </div>

                <div className="dashboard-chart-card">
                  <h3>Exercise Accuracy 🧠</h3>
                  {(reportMetrics.exerciseStats || []).slice(0, 4).map((item) => (
                    <div className="dashboard-emotion-row" key={item.id}>
                      <span>{item.id}</span>
                      <div className="dashboard-bar">
                        <span style={{ width: `${item.accuracy}%` }} />
                      </div>
                      <small>{item.accuracy}%</small>
                    </div>
                  ))}
                  {(!reportMetrics.exerciseStats || !reportMetrics.exerciseStats.length) && (
                    <small>No quiz answers recorded yet.</small>
                  )}
                </div>
              </div>
            </>
          )}
          <pre>{report}</pre>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
