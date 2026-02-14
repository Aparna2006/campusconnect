const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { sendAnnouncement, sendUserNotification } = require("../controllers/realtimeController");

const router = express.Router();

router.post("/announcement", protect, authorize("admin"), sendAnnouncement);
router.post("/notify-user", protect, authorize("admin"), sendUserNotification);

module.exports = router;
