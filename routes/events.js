const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/auth");

const {
  getAllEvents,
  getLatestEvents,
  searchEventBySlug,
} = require("../controllers/events");

router.get("/", getAllEvents);
router.get("/latest", getLatestEvents);
router.get("/:slug/:id",searchEventBySlug);

module.exports = router;
