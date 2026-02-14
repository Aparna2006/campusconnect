const Club = require("../models/Club");
const logActivity = require("../utils/activityLogger");

exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    return res.json(clubs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const isCoordinator = club.coordinators.some(
      (id) => String(id) === String(req.user._id)
    );
    const canEdit = req.user.role === "admin" || isCoordinator;

    if (!canEdit) {
      return res.status(403).json({ message: "Access denied" });
    }

    club.name = req.body.name ?? club.name;
    club.description = req.body.description ?? club.description;
    club.logo = req.body.logo ?? club.logo;
    await club.save();

    await logActivity({
      userId: req.user._id,
      action: "Updated club info",
      metadata: { clubId: club._id, name: club.name },
      ipAddress: req.ip,
    });

    return res.json(club);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
