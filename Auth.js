const express = require("express");
const User = require("../modles/User");
const Order = require("../modles/Orders");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const brcypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("../middleware/fetchdetails");
const jwtSecret = "HaHa";
// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered
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

// Authentication a User, No login Requiered
router.post(
  "/login",

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

// Get logged in User details, Login Required.

// Get logged in User details, Login Required.

router.post("/foodData", async (req, res) => {
  try {
    // console.log( JSON.stringify(global.foodData))
    // const userId = req.user.id;
    // await database.listCollections({name:"food_items"}).find({});
    res.send([global.foodData, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.send("Server Error");
  }
});

router.post("/orderData", async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });
  console.log("1231242343242354", req.body.email);

  //if email not exisitng in db then create: else: InsertMany()
  let eId = await Order.findOne({ email: req.body.email });
  console.log(eId);
  if (eId === null) {
    try {
      console.log(data);
      console.log("1231242343242354", req.body.email);
      await Order.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Server Error", error.message);
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.send("Server Error", error.message);
    }
  }
});

router.post("/myOrderData", async (req, res) => {
  try {
    console.log(req.body.email);
    let eId = await Order.findOne({ email: req.body.email });
    //console.log(eId)
    res.json({ orderData: eId });
  } catch (error) {
    res.send("Error", error.message);
  }
});

module.exports = router;
