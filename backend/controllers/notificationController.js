import Notification from "../models/Notification.js";

const serializeNotification = (item) => ({
  id: item._id,
  childId: item.childId,
  type: item.type,
  severity: item.severity,
  title: item.title,
  message: item.message,
  metadata: item.metadata || {},
  isRead: item.isRead,
  createdAt: item.createdAt,
});

export const getNotifications = async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(5, Number(req.query.limit) || 25));
    const childId = typeof req.query.childId === "string" ? req.query.childId : "";
    const unreadOnly = req.query.unreadOnly === "true";
    const query = {
      userId: req.user._id,
      ...(childId ? { childId } : {}),
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(limit);
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      ...(childId ? { childId } : {}),
      isRead: false,
    });

    res.json({
      notifications: notifications.map(serializeNotification),
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({
      notification: serializeNotification(notification),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const childId = typeof req.body?.childId === "string" ? req.body.childId : "";
    const result = await Notification.updateMany(
      {
        userId: req.user._id,
        ...(childId ? { childId } : {}),
        isRead: false,
      },
      { isRead: true }
    );

    res.json({
      updatedCount: result.modifiedCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
