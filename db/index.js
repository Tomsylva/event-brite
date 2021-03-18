// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const Event = require("../models/Event.model");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/potato-brite";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    const fakeEvents = [
      {
        name: "The Amazing Ironhack Hackaton",
        location: "Africa",
        date: new Date(),
        venue: "Local Park",
        organizer: "Ironhack",
        maxAttendees: 50,
        slug: "the-amazing-ironhack-hackaton",
        fee: "5",
        description:
          "Event to show the world what amazing things you have learned in the bootcamp!",
      },
      {
        name: "Techno Concert",
        location: "Berlin",
        date: new Date(),
        venue: "Hardcore Club",
        organizer: "TechnoBetaz",
        maxAttendees: 200,
        slug: "techno-concert",
        fee: "20",
        description: "Vibing with cool beats.",
      },
      {
        name: "Sandstorm Watching",
        location: "Madrid",
        date: new Date(),
        venue: "Local Park",
        organizer: "Hugo Dib",
        maxAttendees: 80,
        slug: "sandstorm-watching",
        fee: "5",
        description:
          "Event to show the world what amazing things you have learned in the bootcamp!",
      },
      {
        name: "Savannah Safari",
        location: "Canary Islands",
        date: new Date(),
        venue: "Local Jungle",
        organizer: "An Amazing Company",
        maxAttendees: 15,
        slug: "savannah-safari",
        fee: "10",
        description: "Let's see amazing fauna & flora!",
      },
      {
        name: "Burj Khalifa Climbing",
        location: "Dubai",
        date: new Date(),
        venue: "Burj Khalifa",
        organizer: "Hugo Dib",
        maxAttendees: 10,
        slug: "burj-khalifa-climbing",
        fee: "30",
        description: "Bring a jacket, might get chilly up there.",
      },
      {
        name: "Cockroach Assembly",
        location: "Utrecht",
        date: new Date(),
        venue: "old apartment",
        organizer: "Cockroachezz",
        maxAttendees: 50,
        slug: "cockroach-assembly",
        fee: "5",
        description: "Worldwide cockroach mutiny time!! :firecracker:",
      },
      {
        name: "Singing in the Rain",
        location: "Den Haag",
        date: new Date(),
        venue: "Local Beach",
        organizer: "Another Random Company",
        maxAttendees: 50,
        slug: "singing-in-the-rain",
        fee: "5",
        description: "Is there anything better than this ?!",
      },
      {
        name: "Porcupine Baby Proofing",
        location: "Nuremberg",
        date: new Date(),
        venue: "Local Zoo",
        organizer: "Local Zoo",
        maxAttendees: 40,
        slug: "porcupine-baby-proofing",
        fee: "7",
        description: "Self explanatory, isn't it!",
      },
      {
        name: "To Find Which One Flew Over The Coocoo's Nest",
        location: "Amsterdam",
        date: new Date(),
        venue: "Mental Asylum",
        organizer: "Arkham Asylum",
        maxAttendees: 70,
        slug: "to-find-which-one-flew-over-the-coocoos-nest",
        fee: "50",
        description:
          "Let's all find out which one flew over the coocoo's nest!",
      },
      {
        name: "Beer tasting",
        location: "Dubai",
        date: new Date(),
        venue: "Local Pub",
        organizer: "Just Drink Inn",
        maxAttendees: 60,
        slug: "beer-tasting",
        fee: "5",
        description:
          "How many beers can you chug in 5mins? Doesnt matter, we will be here all afternoon! :beer:",
      },
    ];

    // Event.insertMany(fakeEvents).then(() => {
    //   console.log("Hey there sailor");
    // });
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
