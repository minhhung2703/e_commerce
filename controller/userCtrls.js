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

//Update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateaUser = await User.findByIdAndUpdate(id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        });
        res.json(updateaUser);
    } catch (error) {
        throw new Error(error);
    }
})

// Get all users
const getAllUser = async (req, res, next) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error)
    }
}

//get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const getaUser = await User.findByIdAndDelete(id);
    if (getaUser) {
        res.json(getaUser);
    } else {
        throw new Error('Invalid Credential');
    }
    // try {
    //     const getaUser = await User.findById(id);
    //     res.json({
    //         getaUser
    //     });
    // } catch (error) {
    //     throw new Error(error)
    // }
});

//delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleteaUser = await User.findByIdAndDelete(id);
    if (deleteaUser) {
        res.json(deleteaUser);
    } else {
        throw new Error('Invalid Credential');
    }

    // try {
    //     const deleteaUser = await User.findByIdAndDelete(id);
    //     res.json({
    //         deleteaUser,
    //     });
    // } catch (error) {
    //     throw new Error('Invalid Credential');
    // }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getaUser,
    deleteaUser,
    updateaUser
};