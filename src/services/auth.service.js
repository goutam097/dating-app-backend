const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const UserModel = require("../models/user.model");

const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    return otp;
}

const isProfileComplete = async (user) => {
    const requiredFields = [
        'first_name',
        'gender',
        'images',
        'marital_status',
        'dob',
        'address',
        'height',
        'religion',
        'mother_tongue',
        'smoking',
        'drinking',
        'occupation',
        'income'
    ]

    const isComplete = requiredFields.every((field) => {
        if (user[field] === undefined || user[field] === null || user[field] === '') {
            return false;
        }
        return true;
    });
    return isComplete;
}

const getOtp = async (phone) => {
    const isExist = await UserModel.findOne({ phone: phone });
    if (!isExist) {
        await UserModel.create({ phone: phone });
    }
    const otp = generateOtp()
    await UserModel.updateOne({ phone: phone }, { otp: otp });
    return otp;
}

const verifyOtp = async (phone, otp) => {
    const user = await UserModel.findOne({ phone: phone });
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }
    if (user.otp !== otp) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }
    return {
        user: user,
        isProfileComplete: await isProfileComplete(user),
    };
}

const updateProfile = async (id, data) => {
    await UserModel.updateOne({ _id: id }, data)
    return await UserModel.findById(id).select("-otp -__v -createdAt -updatedAt").lean();
}


module.exports = {
    getOtp,
    verifyOtp,
    updateProfile
}