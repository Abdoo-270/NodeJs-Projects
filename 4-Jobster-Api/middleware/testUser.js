const { BadRequestError } = require("../errors");

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError(
      "test user, read only please sign in to add or organize your jobs"
    );
  }
  next();
};

module.exports = testUser;
