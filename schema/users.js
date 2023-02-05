const { request } = require("express");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
    required: true,
    unique:true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  bio: {
    type: String,
  },
  scores: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Score'
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    },
});


userSchema.methods.generateAuthToken = function(){
  const user = this;
  
  const token = jwt.sign({id: user.id, email:user.email}, process.env.SECRET_TOKEN, {expiresIn:"1hr"});
console.log(token,"tokennn")
  return token;
}


const User = mongoose.model("User", userSchema);

module.exports = User;
