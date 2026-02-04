const userModel = require("../models/user.model");
const { signAccessToken } = require("../utils/jwt");
const throwError = require("../utils/throwError");

class AuthService {
    async register(userData) {
        const user = await userModel.create(userData);
        return user;
    }

    async login(userData) {
        const user = await userModel.findOne({ email: userData.email });
        if (!user) { throwError("Invalid email or password"); }

        const isMatch = await user.comparePassword(userData.password);
        if (!isMatch) { throwError("Password not compare"); }

        const token = signAccessToken({ id: user._id, email: user.email });
        return { user, token };
    }
}


module.exports = new AuthService();
