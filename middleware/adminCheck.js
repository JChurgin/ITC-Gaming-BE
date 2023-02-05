const jwt = require("jsonwebtoken");
const User = require("../schema/users");
async function adminCheck (req, res, next) {
  const userFromDB= await User.findById(req?.user?.id)
    if(userFromDB?.role!=="admin"){
      return res.status(403).send()
    }
  next()
  }

  module.exports={adminCheck}