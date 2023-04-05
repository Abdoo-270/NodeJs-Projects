const { BadRequestError } = require("../errors");

const JWT = require("jsonwebtoken");

const login = (req, res) => {
  const { username, password } = req.body;
  //mongoose validation
  //Joi
  //Check in the controller

  if (!username || !password) {
    throw new BadRequestError("please provide email and password");
  }

  //just for demo, normally provided by DB!!
  const id = new Date().getDate();

  //try to keep payload small, better experience for user
  //just for demo in production long, complex and unguessable string value!!

  const token = JWT.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "user created", token });
};

const dashboard = (req, res) => {
  console.log(req.user);
  const randomNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your random number is ${randomNumber}`,
  });
};

module.exports = {
  login,
  dashboard,
};
