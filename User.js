const mongoose = require("mongoose");

const { Schema } = mongoose;
const UserName = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("user", UserName);
// this is a way to create a schema in mongodb and by doing operaion on user like create and all will add the user to th database
//user have 3 parameters name email and passord
