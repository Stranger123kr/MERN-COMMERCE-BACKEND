// check user is present or not
const passport = require("passport");
exports.Auth = (req, res) => {
  return passport.authenticate("jwt");
};

// sanitizeUser prevent user related information

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

// cookieExtractor method

exports.cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["Jwt_token"];
  }
  return token;
};
