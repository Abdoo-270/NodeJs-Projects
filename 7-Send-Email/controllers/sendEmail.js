const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEthereal = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kiara.stroman7@ethereal.email",
      pass: "4skSz5b7YJ7wuqJ6mZ",
    },
  });

  let info = await transporter.sendMail({
    from: '"FlyCargo" <flycargo@gmail.com>',
    to: "someone@gmail.com",
    subject: "vertification email",
    html: "<h2>please click the link to activate your account</h2>",
  });
  res.json(info);
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "aboody27073@gmail.com", // Change to your recipient
    from: "abdoo27073@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  const info = await sgMail.send(msg);
  res.json(info);
};
module.exports = sendEmail;
