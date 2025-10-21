const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authRequired(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const [, token] = hdr.split(" ");
    if (!token) return res.status(401).json({ error: "Auth required" });

    const p = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const role = p.role || (p.isAdmin ? "admin" : "student");
    const isAdmin =
      typeof p.isAdmin === "boolean" ? p.isAdmin : role === "admin";

    req.user = {
      uid: p.uid || p.id || p._id,
      email: p.email,
      role,
      isAdmin,
    };

    if (!req.user.uid) return res.status(401).json({ error: "Invalid token" });
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function isAdmin(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: "Auth required" });

    if (req.user.isAdmin === true || req.user.role === "admin") {
      return next();
    }

    const u = await User.findById(req.user.uid).select("role isAdmin");
    const adminFlag = u?.isAdmin === true || u?.role === "admin";
    if (!adminFlag) return res.status(403).json({ error: "Admin only" });

    req.user.role = u.role || (u.isAdmin ? "admin" : "student");
    req.user.isAdmin = true;

    next();
  } catch (e) {
    next(e);
  }
}

module.exports = { authRequired, isAdmin };
