const customError = require("../errors");
const { isTokenValid } = require("../utils/jwt");
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new customError.UnauthenticatedError("invalid authentication");
  }
  try {
    const { name, role, userId } = isTokenValid({ token });
    req.user = { name, role, userId };
    next();
  } catch (error) {
    throw new customError.UnauthenticatedError("invalid authentication");
  }
};
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.UnauthorizedError(
        "unautherithed to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
