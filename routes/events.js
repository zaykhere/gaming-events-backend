const express = require("express");
const router = express.Router();

const {getAllEvents} = require("../controllers/events");

router.get("/events", getAllEvents);

module.exports = router;