const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const validateBody = require("../middleware/validate");
const {
  createOpportunity,
  getAllOpportunities,
  applyToOpportunity,
  getRecommendedOpportunities,
  seedOpportunities,
  updateOpportunityStatus,
} = require("../controllers/opportunityController");
const {
  createOpportunitySchema,
  opportunityStatusSchema,
} = require("../validators/schemas");

const router = express.Router();

router.post("/seed", protect, authorize("admin"), seedOpportunities);
router.post("/", protect, validateBody(createOpportunitySchema), createOpportunity);
router.get("/", getAllOpportunities);
router.post("/:id/apply", protect, applyToOpportunity);
router.get("/recommended", protect, getRecommendedOpportunities);
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  validateBody(opportunityStatusSchema),
  updateOpportunityStatus
);


module.exports = router;
