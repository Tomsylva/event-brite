const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User.model");

const saltRounds = 10;

// SIGNUP
router.get("/signup", (req, res) => {
  // req.session.visitSignup = true;
  res.render("signup");
});

router.post("/signup", (req, res) => {
  // console.log(req.body);
  const { name, username, email, password } = req.body;

  if (!name || !email || !username) {
    res.render("signup", { errorMessage: "All fields are required" });
    return;
  }

  if (password.length < 8) {
    res.render("signup", {
      errorMessage: "Password must be at least 8 characters",
    });
    return;
  }

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
    }).then((createdUser) => {
      console.log("createdUser: ", createdUser);
      req.session.userId = createdUser._id;
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res) => {
  const { name, username, email, password } = req.body;
  console.log("req.body:", req.body);
  User.findOne({ $or: [{ username }, { email }] })
    .then((found) => {
      if (found) {
        res.render("signup", {
          errorMessage: "Oops, username/email already taken",
        });
        return;
      }
      // Here we know that the username is unique
      const generatedSalt = bcrypt.genSaltSync(saltRounds);
      console.log("generatedSalt:", generatedSalt);
      const hashedPassword = bcrypt.hashSync(password, generatedSalt);
      console.log("hashedPassword:", hashedPassword);
      User.create({
        username,
        email,
        name,
        password: hashedPassword,
      }).then((createdUser) => {
        console.log("createdUser:", createdUser);
        // req.session.userId = createdUser._id
        req.session.user = createdUser;
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log("Err", err);
      res.render("signup", { errorMessage: "Oppsie daisy" });
    });
});

router.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).then((found) => {
    // !found => means no user
    if (!found) {
      res.render("login", { errorMessage: "Wrong credentials" });
      return;
    }
    // WE KNOW WE HAVE THE RIGHT USER
    // VALIDATE THE PASSWORD
    const isSamePassword = bcrypt.compareSync(password, found.password);
    // compareSync -> boolean -> compareSync true? the user wrote the exact same password as before. false ? wrong password
    if (!isSamePassword) {
      res.render("login", { errorMessage: "Wrong credentials" });
      return;
    }
    // SUCCESSFUL LOGIN
    req.session.user = found;
    res.redirect("/");
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
