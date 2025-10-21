const express = require("express");
const mongoose = require("mongoose");
const { authRequired, isAdmin } = require("../middleware/auth");
const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendMail } = require("../utils/mailer");

const router = express.Router();
router.use(authRequired, isAdmin);

router.get("/", async (req, res) => {
  const {
    query = "",
    role = "all",           
    status = "all",         
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {};
  if (query) {
    const rx = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ email: rx }, { name: rx }];
  }
  if (role !== "all") filter.role = role; 
  if (status === "active") filter.isSuspended = { $ne: true };
  if (status === "suspended") filter.isSuspended = true;

  const per = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(1, Number(page) || 1) - 1) * per;

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per)
      .select("_id name email role isAdmin isSuspended createdAt lastLoginAt"),
    User.countDocuments(filter),
  ]);

  res.json({ ok: true, items, total, page: Number(page), limit: per });
});

router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "Invalid user id" });

  const { name, role, isAdmin, isSuspended } = req.body || {};
  const updates = {};

  if (typeof name === "string") updates.name = name;

  if (role === "admin" || role === "student") {
    updates.role = role;
    updates.isAdmin = role === "admin";
  }

  if (typeof isAdmin === "boolean" && !updates.role) {
    updates.isAdmin = isAdmin;
    updates.role = isAdmin ? "admin" : "student";
  }

  if (typeof isSuspended === "boolean") updates.isSuspended = isSuspended;

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
    .select("_id name email role isAdmin isSuspended createdAt lastLoginAt");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ ok: true, user });
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "Invalid user id" });

  const u = await User.findByIdAndDelete(req.params.id);
  if (!u) return res.status(404).json({ error: "User not found" });
  res.json({ ok: true });
});

router.post("/invite", async (req, res) => {
  const { email, name, isAdmin = false } = req.body || {};
  if (!email) return res.status(400).json({ error: "email required" });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name: name || "",
      role: isAdmin ? "admin" : "student",
      isAdmin: !!isAdmin,
      isSuspended: false,
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.create({ email: user.email, code, purpose: "signup", expiresAt });
  try {
    await sendMail({
      to: user.email,
      subject: "You're invited to Smart Trivia",
      text: `Hi${user.name ? " " + user.name : ""}, your OTP is ${code}. It expires in 10 minutes.`,
    });
  } catch (_) {}

  res.status(201).json({ ok: true, userId: user._id });
});

router.post("/:id/reset-password", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "Invalid user id" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await Otp.create({ email: user.email, code, purpose: "reset", expiresAt });
  try {
    await sendMail({
      to: user.email,
      subject: "Password reset",
      text: `Your Smart Trivia reset code is ${code} (valid for 10 minutes).`,
    });
  } catch (_) {}

  res.json({ ok: true });
});

module.exports = router;
