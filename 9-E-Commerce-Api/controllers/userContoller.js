const User = require("../models/User");
const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attatchCookiesToResponse,
  createTokenUser,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);

  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ nth: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("-password");
  //const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new customError.NotFoundError(`couldn't find user with id ${userId}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user using user.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new customError.BadRequestError(
      "please provide values you want to update"
    );
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  user.save();
  const tokenUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  console.log(req.user);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError("please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new customError.UnauthenticatedError("ivalid credintials");
  }
  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "your password is updated succesfully" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

/*
# update user by findByIdAndUpdate()
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new customError.BadRequestError(
      "please provide values you want to update"
    );
  }
  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
*/
