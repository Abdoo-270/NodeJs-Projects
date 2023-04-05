const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const { attatchCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const isEmailAlreadyExist = await User.findOne({ email });
  if (isEmailAlreadyExist) {
    throw new customError.BadRequestError("email already found");
  }
  // the first user will be the admin
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";
  const user = await User.create({ email, name, password, role });

  const tokenUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ tokenUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError("invalid email or password");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError("invalid email or password");
  }
  const tokenUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = {
  register,
  login,
  logout,
};
