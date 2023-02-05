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
const Score = require("../schema/scores");

const createScore = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const userId = user._id;
    const gameName = req.params.game;
    const newScore = {
      userId,
      gameName,
      score: req.body.score,
      date: Date.now(),
    };
    const score = await new Score(newScore).save();
    res.status(201).send(score);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllScores = async (req, res) => {
  try {
    const allScores = await Score.find();
    if (!allScores) {
      return res.status(404).send("No scores found");
    }
    if (allScores) {
      res.status(200).json(allScores);
    }
  } catch (err) {
    console.log(err);
    res.stats(500).send(err);
  }
};

const getAllGameScores = async (req, res) => {
  try {
    const { game } = req.params;
    const allGameScores = await Score.find({ gameName: game });
    if (!allGameScores) {
      return res.status(404).send("No scores found");
    }
    if (allGameScores) {
      res.status(200).json(allGameScores);
    }
  } catch (err) {
    console.log(err);
    res.stats(500).send(err);
  }
};

const getUserScores = async (req, res) => {
  try {
    const { id } = req.body.userId;
    const scores = await Score.find({ userId: id });
    if (!scores) {
      return res.status(404).send("No scores found");
    }
    if (scores) {
      res.status(200).json(scores);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getLastScore = async (req, res) => {
  try {
    const { id } = req.body.userId;
    const { game } = req.params;
    const lastScore = await Score.find({ user: id, game: game })
      .sort({ date: -1 })
      .limit(1);
    if (!lastScore) {
      return res.status(404).send("No scores found");
    }
    if (lastScore) {
      res.status(200).json(lastScore);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getHighScore = async (req, res) => {
  try {
    const { id } = req.body.userId;
    const { game } = req.params;
    const highScore = await Score.find({ user: id, game: game })
      .sort({ score: -1 })
      .limit(1);
    if (!highScore) {
      return res.status(404).send("No scores found");
    }
    if (highScore) {
      res.status(200).json(highScore);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  createScore,
  getAllScores,
  getAllGameScores,
  getUserScores,
  getLastScore,
  getHighScore,
};
