const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const { adminCheck } = require("../middleware/adminCheck");
const {
  findUser,
  passwordCompare,
  genrateToken,
} = require("../middleware/UsersMiddleware");
const User = require("../schema/users");
const router = express.Router();
const scoreControllers = require("../controllers/score");

router.post("/:game", auth, scoreControllers.createScore);

router.get("/", auth, scoreControllers.getAllScores);

router.get("/:game", auth, scoreControllers.getAllGameScores);

router.get("/userscores", auth, scoreControllers.getUserScores);

router.get("/last/:game", auth, scoreControllers.getLastScore);

router.get("/high/:game", auth, scoreControllers.getHighScore);

module.exports = router;
