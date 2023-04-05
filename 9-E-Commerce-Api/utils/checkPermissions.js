const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const checkPermissions = (requestUser, resourceUserId) => {
  //console.log(requestUser);
  //console.log(resourceUserId);
  //console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new customError.UnauthorizedError(
    "the user not autherized to access this route"
  );
};

module.exports = checkPermissions;
