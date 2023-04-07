// import { useNavigate } from "react-router-dom";
const express = require("express");
const router = express.Router();
const User = require("../modles/User");
const { body, validationResult } = require("express-validator");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret = "mynameisshivanshs";

// const navi = useNavigate();

router.post(
  "/createuser",
  body("name").isAlpha(), //we are defining the type of name we want from user
  body("email").isEmail(),
  body("password").isLength({ min: 5 }), //we ware proving a condition the password should contain min 5 chars
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await brcypt.genSalt(10);
    const securepass = (req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepass, //  we have made the password secure by bcrypt
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error); // if the user details are added to th database succesfully it will return the success true and false if some error occured
      res.json({ success: false });
    }
  }
  // when there will be request for create user using signup page it will take 3 parameters name email and password and will vaidate useing epress validator  that the details provided by the
  // user is correct or note like password shoud contain min 5 char and email should be proper manner
);
router.post(
  "/loginuser",

  body("email").isEmail(),

  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let email = req.body.email;
      let userdata = await User.findOne({ email });
      if (!userdata) {
        return res
          .status(400)
          .json({ errors: "try email correct credentials" });
      }
      const comparepass = brcypt.compare(req.body.password, userdata.password);
      if (!comparepass) {
        return res.status(400).json({ errors: "password invalid" });
      }
      const data = {
        user: {
          id: userdata.id,
        },
      };
      const authToken = jwt.sign(data, jwtsecret);
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);
      res.json({ success: "false " });
    }
  }
);
module.exports = router;
// this is an other router for loggin user and will take two parameters and will check if the email is present and if prent it will sent all deails as userData and through that
//we can check for password provided by user from req.body.password and userData.password as the name is password for both feilds database and form
