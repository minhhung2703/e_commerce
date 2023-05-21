const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodb')
const { generateRefreshToken } = require('../config/refreshToken')

//create a user
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
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateauser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true, }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
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
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updateaUser = await User.findByIdAndUpdate(_id, {
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
    validateMongodbId(id);
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
    // validateMongodbId(_id);
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

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(block);
    } catch (error) {
        throw new Error(error)
    }
})
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json(unblock);
    } catch (error) {
        throw new Error(error);
    }
})
module.exports = {
    createUser,
    loginUserCtrl,
    getAllUser,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser
};