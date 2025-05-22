const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const slugify = require('../models/plugins/slugify');
const UserModel = require("../models/user.model");

const register = async (data) => {
    if (await UserModel.isEmailTaken(data.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    const full_name = `${data?.first_name} ${data?.last_name ? data?.last_name : ''}`;
    const slug = slugify(full_name);
    const userCount = await UserModel.count({ slug: {$regex: slug, $options: 'i',} });
    data.slug = `${slug}${userCount ? userCount + 1 : ''}`;
    return await UserModel.create(data)
}

const login = async (email, password) => {
    const user = await UserModel.findOne({ email: email })
        .select(
            '_id first_name last_name full_name password phone profile_image email status'
        )
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email");
    }
    if (!(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect password");
    }
    if (!(user.status == true)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Blocked account");
    }
    delete user?._doc?.password;
    delete user?._doc?.status;
    return user._doc;
};

module.exports = {
    register,
    login,
}