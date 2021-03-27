const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LOCATION_ENUM = require("../utils/consts");

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 10,
  },
  location: {
    type: String,
    required: true,
    default: "Berlin",
    enum: LOCATION_ENUM,
  },
  date: {
    type: Date,
    attendees: {
      type: [String],
      default: [],
    },
  },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  venue: {
    type: String,
    required: true,
  },
  mainPic: {
    type: String,
    default:
      "https://i.guim.co.uk/img/media/3aa0344c8039b86f4f7bd3981ae81d54dc985119/0_137_2741_1644/master/2741.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=fbc84162450a71e07d326f9c694eb678",
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  maxAttendees: {
    type: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  fee: {
    type: String,
  },
  description: {
    type: String,
    min: 20,
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;
