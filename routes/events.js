const express = require("express");
const router = express.Router();

const {getAllEvents, getLatestEvents} = require("../controllers/events");

router.get("/", getAllEvents);
router.get("/latest", getLatestEvents);

module.exports = router;