const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    if (!req.headers.authorization) {
      res.status(401).send("Authorization headers required");
      return;
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const isVerified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.body.userId = isVerified.id;
    next();
  };



module.exports = { auth };
