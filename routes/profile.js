const express = require("express");
const isLoggedMiddleWare = require("../middleware/MustBeLoggedIn");
const User = require("../models/User.model");

const router = express.Router();

router.get("/", isLoggedMiddleWare, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/edit", isLoggedMiddleWare, (req, res) => {
  res.render("edit-profile", { user: req.session.user });
});

router.post("/edit", isLoggedMiddleWare, (req, res) => {
  const { name, shortBio } = req.body;
  User.findByIdAndUpdate(
    req.session.user._id,
    { name, shortBio },
    { new: true }
  ).then((newUser) => {
    // console.log("newUser: ", newUser);
    req.session.user = newUser;
    res.redirect("/profile");
  });
});

module.exports = router;
