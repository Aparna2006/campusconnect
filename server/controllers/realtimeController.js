const logActivity = require("../utils/activityLogger");
const { getIO } = require("../socket");

exports.sendAnnouncement = async (req, res) => {
  try {
    const { message, title } = req.body;
    const io = getIO();

    if (io) {
      io.emit("announcement:new", {
        id: Date.now(),
        title: title || "Campus Announcement",
        message,
        createdAt: new Date().toISOString(),
      });
    }

    await logActivity({
      userId: req.user._id,
      action: "Sent live announcement",
      metadata: { title: title || "Campus Announcement" },
      ipAddress: req.ip,
    });

    return res.json({ message: "Announcement sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendUserNotification = async (req, res) => {
  try {
    const { userId, message, title } = req.body;
    const io = getIO();

    if (io) {
      io.to(`user:${userId}`).emit("notification:new", {
        id: Date.now(),
        title: title || "Notification",
        message,
        createdAt: new Date().toISOString(),
      });
    }

    await logActivity({
      userId: req.user._id,
      action: "Sent direct notification",
      metadata: { targetUserId: userId, title: title || "Notification" },
      ipAddress: req.ip,
    });

    return res.json({ message: "Notification sent" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
