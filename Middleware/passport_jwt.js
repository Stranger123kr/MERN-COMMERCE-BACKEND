const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../Model/User"); // Assuming the User model is defined in models/User.js
const { sanitizeUser, cookieExtractor } = require("../Middleware/Services");
//   ======================================

exports.Passport_jwtAuthentication = (passport) => {
  // ...
  let opts = {};
  opts.jwtFromRequest = cookieExtractor;
  opts.secretOrKey = process.env.JWT_SECRET_KEY; // Use the secret key stored in an environment variable

  passport.use(
    "jwt",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);

        if (user) {
          return done(null, sanitizeUser(user)); // // this line send to serializer
        } else {
          return done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    })
  );

  // this create session variable req.user on being called from function

  passport.serializeUser((user, done) => {
    try {
      return done(null, user.id);
    } catch (error) {
      return done(error, false);
    }
  });

  // this change session variable req.user when called from authorized request

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });
};
