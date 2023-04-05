const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  email,
  name,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>click the following link to verify your email:<a href="${verifyEmail}">verify email</a> </p>`;
  return sendEmail({
    to: email,
    subject: "email confirmation",
    html: `<h4>Hello ${name} </h4>${message}`,
  });
};

module.exports = sendVerificationEmail;
