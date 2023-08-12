const express = require("express");
const router = express.Router();
const { register } = require("./auth");
const { login } = require("./auth");
const { update } = require("./auth");
const { deleteUser } = require("./auth");
const { adminAuth } = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.put("/update", adminAuth, update);
router.delete("/delete", adminAuth, deleteUser);

module.exports = router;
