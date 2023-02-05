const jwt = require("jsonwebtoken");
const User = require("../schema/users");
const bcrypt = require("bcrypt");


const findUser=  async(req,res,next)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email})

    if(!user){
        return res.status(404).send("User doesn't exist");
    }
    req.user=user
    console.log(req.user)
    req.password=password
    next()

}
const passwordCompare= async(req,res,next)=>{
const user=req.user
const password=req.password
            
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(404).send("passwords dosent match!")
    }
    next()
}

const genrateToken= async(req,res,next)=>{
    const user=req.user
    const token = user.generateAuthToken()
    res.cookie("token", token, {httpOnly:true})
     res.send({user, token})
next()
}

module.exports= {findUser,passwordCompare,genrateToken}