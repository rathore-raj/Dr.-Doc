/**
 * User account related routes
 */

const express = require("express");

// models
const User = require("../model/user.js");

// middlewares
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ User: user, token });
  } catch (e) {
    res.status(400).send({ Message: e.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ User: user, token });
  } catch (e) {
    res.status(400).send({ Message: e.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.status(200).send("Done!");
  } catch (e) {
    res.status(500).send({ Message: e.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).send({ User: req.user });
  } catch (e) {
    res.status(400).send({ Message: e.message });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Done😃");
  } catch (e) {
    res.status(500).send({ Message: e.message });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send("Deleted!");
  } catch (e) {
    res.status(500).send({ Message: e.message });
  }
});

module.exports = router;
