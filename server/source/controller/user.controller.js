import userModel from "../model/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import "dotenv/config";

/** 🔹 Generate JWT Token */
const generateToken = (user) => {
  return jsonwebtoken.sign(
    { data: user.id },
    process.env.TOKEN_SECRET,
    { expiresIn: "24h" }
  );
};

/** 🔹 User Signup */
const signup = async (req, res) => {
  try {
    const { username, password, displayName, email } = req.body;

    const checkUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (checkUser) return responseHandler.badrequest(res, "Username or email already used");

    const user = new userModel({
      username,
      displayName,
      email,
      authProvider: "local",
    });

    user.setPassword(password);
    await user.save();

    const token = generateToken(user);

    responseHandler.created(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      }
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

/** 🔹 User Signin */
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel
      .findOne({ username, authProvider: "local" })
      .select("username password salt id displayName email");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    const token = generateToken(user);

    responseHandler.ok(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      }
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

/** 🔹 Google OAuth Callback */
const googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) return responseHandler.unauthorize(res);

    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      user = new userModel({
        googleId: req.user.id,
        email: req.user.email,
        displayName: req.user.displayName,
        avatar: req.user.avatar,
        authProvider: "google",
      });
      await user.save();
    }

    const token = generateToken(user);

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google?token=${token}&userId=${user.id}`;
    return res.redirect(redirectUrl);

  } catch (error) {
    return responseHandler.error(res, "Google authentication failed");
  }
};

/** 🔹 Update Password */
const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt authProvider");

    if (!user) return responseHandler.unauthorize(res);

    if (user.authProvider === "google") {
      return responseHandler.badrequest(res, "Cannot update password for Google accounts");
    }

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);
    await user.save();

    responseHandler.ok(res, { message: "Password updated successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

/** 🔹 Get User Info */
const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password -salt");

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  googleAuthCallback,
  getInfo,
  updatePassword,
};
