const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const { adminCheck } = require("../middleware/adminCheck");
const { findUser, passwordCompare, genrateToken } = require("../middleware/usersMiddleware");
const User = require("../schema/users");
const router = express.Router();

router.post('/', async(req, res) => {
    try {
  
      const user = new User({...req.body});
      if(!user){
          return res.status(404).send('Failed to create user')
      }
      try {
          user.password = await bcrypt.hash(user.password, 10);
          await user.save()
          
      } catch (error) {
          console.log(error)
          return res.status(400).send("Email is already registered");
      }
      
      const token = user.generateAuthToken()
  console.log(token,"hey look at me im Mr Messeks")
       res.cookie("token", token, {httpOnly:true})
       
       res.send({user, token})
       // if (userAdded) {
      //   res.send(newUser);
      // }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });

  router.post("/login",findUser,passwordCompare,genrateToken, async(req,res)=>{
     
  })

  router.patch('/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      if (req.body.oldPassword && req.body.oldPassword.trim().length > 0) {
        const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).send({ message: 'Old password is incorrect' });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newPassword, salt);
        user.password = hash;
      }
  
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.nickName = req.body.nickName;
  
      const updatedUser = await user.save();
      console.log(updatedUser,"ddd")
      res.send({ ...updatedUser.toObject(), password: undefined });

    } catch (err) {
      return res.status(500).send(err);
    }
  });

  router.get("/usersdb",auth,adminCheck, async(req,res)=>{
    const result = await User.find();
    
    console.log(result, "#3")
    res.send(result)
  })




  module.exports = router;
