module.exports = (req, res, next) => {
  // if (!req.session.admin.id) { // crashes if req.session.admin is undefined
  if (!req.session.admin || !req.session.admin.id) {
    return res.redirect("/api/v1/admin/login");
  }
  next();
};

// This is your gatekeeper.