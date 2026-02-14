const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({ userId, action, metadata = {}, ipAddress = "" }) => {
  if (!userId || !action) return;

  try {
    await ActivityLog.create({ userId, action, metadata, ipAddress });
  } catch (error) {
    // Avoid blocking request flow if logging fails.
    console.error("Activity log failed:", error.message);
  }
};

module.exports = logActivity;
