const express = require("express");
const router = express.Router();

router.post("/sample", (req, res) => {
  try {
    res.send(global.sample);
  } catch (error) {
    res.send("error");
  }
});
module.exports = router;
