const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User.model");

const saltRounds = 10;

// SIGNUP
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  // console.log(req.body);
  const { name, username, email, password } = req.body;
  User.findOne({ $or: [{ username }, { email }] }).then((found) => {
    // console.log("Found: ", found);
    if (found) {
      res.render("signup", { errorMessage: "Oops, username taken" });
      return;
    }
    const generatedSalt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);
    User.create({
      username,
      email,
      name,
      password: hashedPassword,
    }).then(() => {
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;
  User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).then((found) => {
    if (!found) {
      res.render("login", { errorMessage: "No user with that name" });
      return;
    }
    // VALIDATE PASSWORD
    const isSamePassword = bcrypt.compareSync(password, found.password);
    if (!isSamePassword) {
      res.render("login", { errorMessage: "Wrong credentials" });
      return;
    }
    // SUCCESS LOGIN
    res.redirect("/");
  });
});

module.exports = router;
