const express = require("express");
const Event = require("../models/Event.model");
const Organization = require("../models/Organization.model");
const isLoggedMiddleware = require("../middleware/MustBeLoggedIn");

const router = express.Router();

router.get("/", (req, res) => {
  const eventName = new RegExp(req.query.event, "i");
  Event.find({ name: { $regex: eventName } }).then((alLEvents) => {
    // console.log("alLEvents:", alLEvents);
    res.render("eventsPage", { eventList: alLEvents });
  });
});

router.get("/lucky", (req, res) => {
  Event.count().then((countOfEvents) => {
    const randomNumber = Math.floor(Math.random() * countOfEvents);
    Event.findOne()
      .skip(randomNumber)
      .then((singleRandom) => {
        // res.render("single-event", { event: singleRandom });
        res.redirect(`/events/${singleRandom.slug}`);
      });
  });
});

router.get("/all", (req, res) => {
  Event.find({}).then((allEvents) => {
    res.render("eventsPage", { eventList: allEvents });
  });
});

router.get("/:dynamicGorilla", (req, res) => {
  Event.findOne({ slug: req.params.dynamicGorilla })
    .populate("organizer")
    .then((thatSingleEvent) => {
      if (!thatSingleEvent) {
        return res.redirect("/");
      }

      let isOrganizingMember;

      if (req.session.user) {
        if (thatSingleEvent.organizer.members.includes(req.session.user._id)) {
          isOrganizingMember = true;
        }
      }
      res.render("single-event", {
        event: thatSingleEvent,
        isOrganizingMember,
      });
    });
});

router.get("/:dynamic/delete", isLoggedMiddleware, (req, res) => {
  Event.findById(req.params.dynamic)
    .populate("organizer")
    .then((event) => {
      if (!event) {
        return res.redirect("/");
      }

      if (!event.organizer.members.includes(req.session.user._id)) {
        return res.redirect("/");
      }

      Event.findByIdAndDelete(event._id)
        .then(() => {
          //EVENT DELETED
          Organization.findByIdAndUpdate(event.organizer._id, {
            $pull: { events: event._id },
          })
            .then(() => {
              return res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

module.exports = router;
