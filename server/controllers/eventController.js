const Event = require("../models/Event");
const logActivity = require("../utils/activityLogger");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue || "On-campus",
      createdBy: req.user._id,
    });

    await logActivity({
      userId: req.user._id,
      action: "Created event",
      metadata: { eventId: event._id, title: event.title },
      ipAddress: req.ip,
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
