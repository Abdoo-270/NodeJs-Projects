const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>please reset your password by clicking this link:
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "RESET PASSWORD",
    html: `<h4>Hello ${name} </h4>${message}`,
  });
};

module.exports = sendResetPasswordEmail;
