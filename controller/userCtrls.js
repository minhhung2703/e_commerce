const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('User Already Exists');
    }
})

const loginUserCtrl = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email: email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credential");
    }
})

module.exports = { createUser, loginUserCtrl };