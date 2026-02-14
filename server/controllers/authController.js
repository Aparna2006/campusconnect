const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/activityLogger");
const { sendEmail } = require("../utils/emailService");

const buildAuthResponse = (user, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      role: user.role,
    },
  };
};

const setAuthCookie = (res, token) => {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedName = (name || "").trim();
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const requestedRole = role === "admin" ? "student" : role;
    const safeRole =
      ["student", "recruiter", "club_coordinator"].includes(requestedRole)
        ? requestedRole
        : "student";

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: safeRole,
    });

    const payload = buildAuthResponse(user, "User registered successfully");
    setAuthCookie(res, payload.token);

    await logActivity({
      userId: user._id,
      action: "User registered",
      metadata: { role: user.role },
      ipAddress: req.ip,
    });

    await sendEmail({
      to: user.email,
      subject: "Welcome to CampusConnect",
      text: `Hi ${user.name}, your CampusConnect account is now active.`,
    });

    return res.status(201).json(payload);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = buildAuthResponse(user, "Login successful");
    setAuthCookie(res, payload.token);

    await logActivity({
      userId: user._id,
      action: "User login",
      ipAddress: req.ip,
    });

    return res.json(payload);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
