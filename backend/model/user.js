const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter your name!"],
    },
    email: {
        type: String,
        require: [true, "Please enter your name!"],
    },
    password: {
        type: String,
        require: [true, "Please enter your name!"],
        minLength: [4, " Password should be greater than 4 characters"],
        select: false,
    },
    phoneNumber: {
        type: Number,
    },
    addresses: [
        {
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        },
    ],
    role: {
        type: String,
        default: "user",
    },
    avatar: {
        type: String,
        require: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

//Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES, });
};

//compare password
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

module.exports = mongoose.model("User", userSchema)