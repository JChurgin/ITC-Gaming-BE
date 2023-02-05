const express = require("express");
const router = express.Router();
const UsersModel = require('../schema/users')
const {auth} = require("../middleware/auth");

router.get('/', auth, async (req, res) => {
    // const { username } = req.query;
    console.log("ssssssssssss")
    const profile = await UsersModel.findById( req.body.userId).lean();
    if (profile) {
        delete profile.password;
        res.json(profile)
    } else {
        res.sendStatus(400)
    }
});

module.exports = router;