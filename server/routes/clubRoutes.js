const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validateBody = require("../middleware/validate");
const { getClubs, updateClub } = require("../controllers/clubController");
const { updateClubSchema } = require("../validators/schemas");

const router = express.Router();

router.get("/", getClubs);
router.patch(
  "/:id",
  protect,
  authorize("club_coordinator", "admin"),
  validateBody(updateClubSchema),
  updateClub
);

module.exports = router;
