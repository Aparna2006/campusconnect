const bcrypt = require("bcryptjs");
const User = require("../models/user");
const ActivityLog = require("../models/ActivityLog");

const otpStore = new Map();

// GET PROFILE
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// UPDATE SKILLS
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    req.user.skills = skills;
    await req.user.save();

    res.json({
      message: "Skills updated successfully",
      skills: req.user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const currentSettings = req.user.settings || {};
    const incomingSettings = req.body || {};

    req.user.settings = {
      ...currentSettings,
      ...incomingSettings,
    };

    await req.user.save();
    return res.json(req.user.settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { current, newPassword } = req.body;

    if (!current || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const userWithPassword = await req.user.constructor
      .findById(req.user._id)
      .select("+password");

    if (!userWithPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(current, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    userWithPassword.password = await bcrypt.hash(newPassword, salt);
    await userWithPassword.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE ACCOUNT
exports.deleteMyAccount = async (req, res) => {
  try {
    await req.user.deleteOne();
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, phone, photoUrl } = req.body;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email: email.trim().toLowerCase() });
      if (existing && String(existing._id) !== String(req.user._id)) {
        return res.status(400).json({ message: "Email already in use" });
      }
      req.user.email = email.trim().toLowerCase();
      req.user.emailVerified = false;
    }

    req.user.name = name ?? req.user.name;
    req.user.bio = bio ?? req.user.bio;
    req.user.phone = phone ?? req.user.phone;
    req.user.photoUrl = photoUrl ?? req.user.photoUrl;

    await req.user.save();

    return res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      skills: req.user.skills,
      bio: req.user.bio,
      phone: req.user.phone,
      photoUrl: req.user.photoUrl,
      emailVerified: req.user.emailVerified,
      phoneVerified: req.user.phoneVerified,
      settings: req.user.settings || {},
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// SEND PHONE OTP
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(`phone:${req.user._id}`, { otp, phone, expiresAt: Date.now() + 5 * 60 * 1000 });

    return res.json({
      message: "OTP sent successfully",
      devOtp: otp,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// VERIFY PHONE OTP
exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = otpStore.get(`phone:${req.user._id}`);

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ verified: false, message: "OTP expired or not requested" });
    }

    if (record.phone !== phone || record.otp !== otp) {
      return res.status(400).json({ verified: false, message: "Invalid OTP" });
    }

    req.user.phone = phone;
    req.user.phoneVerified = true;
    await req.user.save();
    otpStore.delete(`phone:${req.user._id}`);

    return res.json({ verified: true, message: "Phone verified" });
  } catch (error) {
    return res.status(500).json({ verified: false, message: error.message });
  }
};

// SEND EMAIL RECOVERY
exports.sendEmailRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    return res.json({ message: `Recovery instructions sent to ${email}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    req.user.emailVerified = true;
    await req.user.save();
    return res.json({ verified: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ verified: false, message: error.message });
  }
};

// CHANGE EMAIL
exports.changeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && String(existing._id) !== String(req.user._id)) {
      return res.status(400).json({ message: "Email already in use" });
    }

    req.user.email = normalizedEmail;
    req.user.emailVerified = false;
    await req.user.save();

    return res.json({ message: "Email updated successfully", email: req.user.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPLOAD PHOTO (URL-based fallback if file upload middleware is not configured)
exports.uploadPhoto = async (req, res) => {
  try {
    if (req.body?.photoUrl) {
      req.user.photoUrl = req.body.photoUrl;
      await req.user.save();
      return res.json({ photoUrl: req.user.photoUrl });
    }

    return res.status(400).json({
      message: "File upload middleware is not configured. Send photoUrl instead.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// MY ACTIVITY LOGS
exports.getMyActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
