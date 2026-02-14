const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateSkills,
  updateSettings,
  changePassword,
  deleteMyAccount,
  updateProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailRecovery,
  verifyEmail,
  changeEmail,
  uploadPhoto,
  getMyActivity,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/skills", protect, updateSkills);
router.put("/settings", protect, updateSettings);
router.post("/change-password", protect, changePassword);
router.post("/send-phone-otp", protect, sendPhoneOtp);
router.post("/verify-phone-otp", protect, verifyPhoneOtp);
router.post("/send-email-recovery", protect, sendEmailRecovery);
router.post("/verify-email", protect, verifyEmail);
router.post("/change-email", protect, changeEmail);
router.post("/upload-photo", protect, uploadPhoto);
router.get("/activity", protect, getMyActivity);
router.delete("/me", protect, deleteMyAccount);

module.exports = router;
