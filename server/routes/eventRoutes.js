const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validateBody = require("../middleware/validate");
const { createEvent, getEvents } = require("../controllers/eventController");
const { createEventSchema } = require("../validators/schemas");

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, authorize("admin"), validateBody(createEventSchema), createEvent);

module.exports = router;
