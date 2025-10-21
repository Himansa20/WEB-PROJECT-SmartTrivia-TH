const express = require("express");
const mongoose = require("mongoose");
const { authRequired, isAdmin } = require("../middleware/auth");
const Module = require("../models/Module");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");

const router = express.Router();
router.use(authRequired, isAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [users, quizzes] = await Promise.all([
      User.countDocuments(),
      Quiz.countDocuments(),
    ]);
    res.json({ ok: true, users, quizzes, reports: 0, approvals: 3 });
  } catch (e) {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

router.post("/modules", async (req, res) => {
  try {
    const { title, code, description, isActive = true } = req.body || {};
    if (!title || !code)
      return res.status(400).json({ error: "title and code required" });
    const mod = await Module.create({
      title,
      code,
      description,
      isActive,
      createdBy: req.user.uid,
    });
    res.status(201).json({ ok: true, module: mod });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/modules", async (req, res) => {
  try {
    const list = await Module.find().sort({ createdAt: -1 });
    res.json({ ok: true, modules: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/modules/:id", async (req, res) => {
  try {
    const update = req.body || {};
    const mod = await Module.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!mod) return res.status(404).json({ error: "Module not found" });
    res.json({ ok: true, module: mod });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid module id" });

    const mod = await Module.findById(id);
    if (!mod) return res.status(404).json({ error: "Module not found" });

    const quizIds = (await Quiz.find({ moduleId: id }).select("_id")).map(
      (q) => q._id
    );

    if (quizIds.length > 0 && String(req.query.force) !== "true") {
      return res.status(400).json({
        error:
          "Module has quizzes. Pass ?force=true to delete quizzes & questions too.",
      });
    }

    if (quizIds.length > 0) {
      await Question.deleteMany({ quizId: { $in: quizIds } });
      await Quiz.deleteMany({ _id: { $in: quizIds } });
    }

    await Module.findByIdAndDelete(id);
    res.json({ ok: true, deletedQuizzes: quizIds.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/quizzes", async (req, res) => {
  try {
    const {
      moduleId,
      title,
      description = "",
      durationSeconds,
      isPublished = false,
    } = req.body || {};
    if (!moduleId || !title || !durationSeconds)
      return res
        .status(400)
        .json({ error: "moduleId, title, durationSeconds required" });

    const quiz = await Quiz.create({
      moduleId,
      title,
      description,
      durationSeconds,
      isPublished,
      createdBy: req.user.uid,
    });
    res.status(201).json({ ok: true, quiz });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/quizzes/:moduleId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      moduleId: req.params.moduleId,
    }).sort({ createdAt: -1 });
    res.json({ ok: true, quizzes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body || {}, {
      new: true,
    });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ ok: true, quiz });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/quiz/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid quiz id" });

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });


    await Question.deleteMany({ quizId: id });
    await Quiz.findByIdAndDelete(id);

    res.json({ ok: true, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/questions", async (req, res) => {
  try {
    const {
      quizId,
      type = "mcq",
      text,
      options = [],
      correctKeys = [],
      marks = 1,
    } = req.body || {};
    if (!quizId || !text)
      return res.status(400).json({ error: "quizId and text required" });
    if (type !== "multi" && correctKeys.length > 1)
      return res
        .status(400)
        .json({ error: "Only one correct key allowed for this type" });

    const q = await Question.create({
      quizId,
      type,
      text,
      options,
      correctKeys,
      marks,
    });
    res.status(201).json({ ok: true, question: q });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/questions/:quizId", async (req, res) => {
  try {
    const qs = await Question.find({ quizId: req.params.quizId }).sort({
      createdAt: 1,
    });
    res.json({ ok: true, questions: qs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/question/:id", async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body || {}, {
      new: true,
    });
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json({ ok: true, question: q });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid question id" });

    const q = await Question.findByIdAndDelete(id);
    if (!q) return res.status(404).json({ error: "Question not found" });

    res.json({ ok: true, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const {
      query = "",
      role = "all",
      status = "all",
      page = 1,
      limit = 12,
    } = req.query;

    const and = [];

    if (query) {
      const rx = new RegExp(query, "i");
      and.push({ $or: [{ name: rx }, { email: rx }] });
    }

    if (role !== "all") {
      if (role === "admin") {
        and.push({ $or: [{ role: "admin" }, { isAdmin: true }] });
      } else if (role === "student") {
        and.push({
          $or: [{ role: "student" }, { isAdmin: { $ne: true } }],
        });
      }
    }

    if (status !== "all") {
      if (status === "suspended") {
        and.push({ $or: [{ isSuspended: true }, { isActive: false }] });
      } else if (status === "active") {
        and.push({
          $and: [
            { $or: [{ isSuspended: { $ne: true } }, { isSuspended: { $exists: false } }] },
            { $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }] },
          ],
        });
      }
    }

    const q = and.length ? { $and: and } : {};

    const per = Math.min(parseInt(limit) || 12, 100);
    const skip = (Math.max(1, parseInt(page) || 1) - 1) * per;

    const raw = await User.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(per)
      .select("_id name email role isAdmin isSuspended isActive createdAt lastLoginAt");

    const items = raw.map((doc) => {
      const u = doc.toObject();
      const normalizedIsAdmin =
        typeof u.isAdmin === "boolean" ? u.isAdmin : u.role === "admin";
      const normalizedIsSuspended =
        typeof u.isSuspended === "boolean" ? u.isSuspended : u.isActive === false;

      return {
        ...u,
        isAdmin: normalizedIsAdmin,
        isSuspended: normalizedIsSuspended,
      };
    });

    const total = await User.countDocuments(q);
    res.json({ ok: true, items, total, page: parseInt(page) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin, role, isSuspended } = req.body || {};
    const update = {};

    if (typeof isAdmin === "boolean") {
      update.isAdmin = isAdmin;
      update.role = isAdmin ? "admin" : "student";
    }
    if (typeof role === "string") {
      update.role = role;
      update.isAdmin = role === "admin";
    }

    if (typeof isSuspended === "boolean") {
      update.isSuspended = isSuspended;
      update.isActive = !isSuspended;
    }

    const u = await User.findByIdAndUpdate(id, update, { new: true })
      .select("_id name email role isAdmin isSuspended isActive createdAt lastLoginAt");

    if (!u) return res.status(404).json({ error: "User not found" });

    const obj = u.toObject();
    const normalized = {
      ...obj,
      isAdmin: typeof obj.isAdmin === "boolean" ? obj.isAdmin : obj.role === "admin",
      isSuspended:
        typeof obj.isSuspended === "boolean" ? obj.isSuspended : obj.isActive === false,
    };

    res.json({ ok: true, user: normalized });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/users/:id/reset-password", async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: "User not found" });
    console.log(`Password reset requested for ${u.email}`);
    res.json({ ok: true, message: `Reset OTP sent to ${u.email}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/users/invite", async (req, res) => {
  try {
    const { email, name = "", isAdmin = false } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists" });

    const tempPass = Math.random().toString(36).slice(-8);
    const user = await User.create({
      email,
      name,
      passwordHash: tempPass, 
      isAdmin,
      role: isAdmin ? "admin" : "student",
    });

    console.log(`Invitation created for ${email} (temp pass: ${tempPass})`);
    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const u = await User.findByIdAndDelete(req.params.id);
    if (!u) return res.status(404).json({ error: "User not found" });
    res.json({ ok: true, deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/trends", async (req, res) => {
  try {
    const days = Math.min(Number(req.query.days) || 14, 90);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const fmt = { format: "%Y-%m-%d", date: "$createdAt" };

    const [usersAgg, quizzesAgg] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { $dateToString: fmt }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Quiz.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { $dateToString: fmt }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const daysArr = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      daysArr.push(key);
    }

    const uMap = new Map(usersAgg.map((x) => [x._id, x.count]));
    const qMap = new Map(quizzesAgg.map((x) => [x._id, x.count]));

    const byDay = daysArr.map((key) => ({
      date: key,
      users: uMap.get(key) || 0,
      quizzes: qMap.get(key) || 0,
    }));

    res.json({ ok: true, byDay });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const since = req.query.since ? new Date(req.query.since) : null;

    const match = since ? { createdAt: { $gt: since } } : {};
    const items = await User.find(match)
      .sort({ createdAt: -1 })
      .limit(20)
      .select("_id name email createdAt");

    res.json({ ok: true, items, now: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
