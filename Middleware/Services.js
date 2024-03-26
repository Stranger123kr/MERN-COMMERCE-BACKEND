const passport = require("passport");
const nodemailer = require("nodemailer");
// ========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "nitesh8825kr@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});
// check user is present or not

exports.Auth = (req, res) => {
  return passport.authenticate("jwt");
};

// ========================================

// sanitizeUser prevent user related information

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

// ========================================

// cookieExtractor method

exports.cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["Jwt_token"];
  }
  return token;
};

// ========================================

exports.SendMail = async ({ to, subject, text, html }) => {
  console.log(to);
  try {
    const info = await transporter.sendMail({
      from: '"Apanee Dukaan", <ApaneeDukaan@gmail.com>', // list of receivers
      to,
      subject,
      text,
      html,
    });
    // console.log("Message sent: %s", info.messageId);
    // res.status(200).json(info);
    return info;
  } catch (error) {
    return error;
    // console.log(error);
    // res.status(404).json(error.message);
  }
};
