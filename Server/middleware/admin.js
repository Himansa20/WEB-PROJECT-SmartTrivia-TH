module.exports.adminRequired = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Auth required" });
  const isAdmin = req.user.isAdmin === true || req.user.role === "admin";
  if (!isAdmin) return res.status(403).json({ error: "Admin only" });
  next();
};
