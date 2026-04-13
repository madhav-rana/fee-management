module.exports = (req, res, next) => {
  if (!req.session.admin.id) {
    return res.redirect("/api/v1/admin/login");
  }
  next();
};

// This is your gatekeeper.