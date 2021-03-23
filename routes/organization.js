const express = require("express");
const LOCATION_ENUM = require("../utils/consts");
const isLoggedMiddleware = require("../middleware/MustBeLoggedIn");
const Organization = require("../models/Organization.model");

const router = express.Router();

// router.get("/baroongaroognga-chungachunga", (req, res) => {
router.get("/my-organization", isLoggedMiddleware, (req, res) => {
  // EVERYONE WHERE I AM THE OWNER
  Organization.find({ owner: req.session.user._id }).then((whereIamOwner) => {
    Organization.find({
      $and: [
        { owner: { $ne: req.session.user._id } },
        { members: { $in: req.session.user._id } },
      ],
    }).then((whereIAmNotOwner) => {
      console.log("owner: ", whereIamOwner);
      console.log("nicht owner: ", whereIAmNotOwner);
      res.render("my-orgs", { owner: whereIamOwner, member: whereIAmNotOwner });

      // {{!-- {{#unless}} --}}

      // {{!-- {{#if owner}}
      // {{!-- USER HAS MULTIPLE (OR ONE) ORG WHERE IS OWNER --}}
      // {{else}}

      // {{!-- USER DOENST OWN ANY ORG --}}
      // {{/if}} --}}
    });
  });
});

router.get("/new", isLoggedMiddleware, (req, res) => {
  res.render("new-organization", {
    locations: LOCATION_ENUM,
    user: req.session.user,
  });
});

router.post("/new", isLoggedMiddleware, (req, res) => {
  const { name, description, location } = req.body;
  if (name.length < 6) {
    res.render("new-organization", { errorMessage: "Your name is too short" });
    return;
  }
  if (!description) {
    res.render("new-organization", {
      errorMessage: "Please fill in description",
    });
    return;
  }
  Organization.findOne({ name }).then((found) => {
    if (found) {
      return res.render("new-organization", {
        errorMessage: "Name already taken, choose a new one",
      });
    }
    Organization.create({
      name,
      location,
      description,
      owner: req.session.user._id,
      members: [req.session.user._id],
    })
      .then((createdOrganization) => {
        res.redirect(`/organization/${createdOrganization._id}`);
      })
      .catch((err) => {
        res.render("new-organization", {
          errorMessage: "Something went wrong",
        });
      });
  });
});

router.get("/:mufasa", (req, res) => {
  Organization.findById(req.params.mufasa)
    .populate("owner")
    .populate("members")
    .then((foundOrg) => {
      if (!foundOrg) {
        return res.redirect("/");
      }
      res.render("single-organization", { organization: foundOrg });
    });
});

module.exports = router;
