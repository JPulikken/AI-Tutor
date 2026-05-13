const API_PATH = "/api";
const FALLBACK_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const parseResponse = async (res, url) => {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(
      isJson
        ? data.error || "Request failed"
        : `Expected JSON from ${url}, but got ${contentType || "an unknown response"}. Make sure the backend is running on port 5000.`
    );
  }

  if (!isJson) {
    throw new Error(
      `Expected JSON from ${url}, but got HTML/text instead. Make sure the backend is running on port 5000 and this API route exists.`
    );
  }

  return data;
};

const request = async (path, options = {}) => {
  const primaryUrl = `${API_PATH}${path}`;
  const res = await fetch(primaryUrl, options);
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const fallbackUrl = `${FALLBACK_API_URL}${path}`;
    const fallbackRes = await fetch(fallbackUrl, options);
    return parseResponse(fallbackRes, fallbackUrl);
  }

  return parseResponse(res, primaryUrl);
};

export const registerUser = async (formData) =>
  request("/auth/register", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

export const loginUser = async (formData) =>
  request("/auth/login", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

export const requestPasswordReset = async (email) =>
  request("/auth/request-reset", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });

export const resetPassword = async (token, newPassword) =>
  request("/auth/reset-password", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ token, newPassword }),
  });

export const getCurrentUser = async (token) =>
  request("/auth/me", {
    headers: getAuthHeaders(token),
  });

export const logoutUser = async (token) =>
  request("/auth/logout", {
    method: "POST",
    headers: getAuthHeaders(token),
  });

export const getProgress = async (token) =>
  request("/progress", {
    headers: getAuthHeaders(token),
  });

export const getChildren = async (token) =>
  request("/children", {
    headers: getAuthHeaders(token),
  });

export const createChild = async (token, child) =>
  request("/children", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(child),
  });

export const updateChild = async (token, childId, child) =>
  request(`/children/${childId}`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(child),
  });

export const updateProgress = async (token, updates) =>
  request("/progress", {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });

export const saveCompletedLesson = async (token, lessonId, stars) =>
  request("/progress/lesson", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ lessonId, stars }),
  });

// Save session
export const saveSession = async (token, sessionData) => {
  return request("/session/save", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(sessionData),
  });
};

// Get report
export const getReport = async (token, childId, childName) => {
  return request("/report", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ childId, childName }),
  });
};

export const getWeeklyDigest = async (token, childId, childName) =>
  request("/report/weekly-digest", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ childId, childName }),
  });

export const chatWithTutor = async (token, payload) =>
  request("/chat", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(
      typeof payload === "string"
        ? { message: payload }
        : payload
    ),
  });

export const getNotifications = async (token, options = {}) => {
  const params = new URLSearchParams();
  if (options.childId) params.set("childId", options.childId);
  if (options.unreadOnly !== undefined) params.set("unreadOnly", String(Boolean(options.unreadOnly)));
  if (options.limit) params.set("limit", String(options.limit));

  return request(`/notifications${params.toString() ? `?${params.toString()}` : ""}`, {
    headers: getAuthHeaders(token),
  });
};

export const markNotificationRead = async (token, notificationId) =>
  request(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
  });

export const markAllNotificationsRead = async (token, childId = "") =>
  request("/notifications/read-all", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ childId }),
  });
