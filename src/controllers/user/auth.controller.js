const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require("../../services/auth.service")
const tokenService = require("../../services/token.service")

const getOtp = catchAsync(async (req, res) => {
    const data = await authService.getOtp(req.body.phone);

    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Otp successfully send to your phone",
        data,
    });
});

const verifyOtp = catchAsync(async (req, res) => {
    const { phone, otp } = req.body;
    const {user, isProfileComplete} = await authService.verifyOtp(phone, otp);
    const tokens = await tokenService.generateAuthTokens(user)

    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Otp verified successfully",
        data: { ...user, accessToken: tokens?.access?.token, refreshToken: tokens?.refresh?.token, isProfileComplete }
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const { id } = req.user;
    const data = await authService.updateProfile(id, req.body);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Profile updated successfully",
        data
    });
});

module.exports = {
    getOtp,
    verifyOtp,
    updateProfile
}