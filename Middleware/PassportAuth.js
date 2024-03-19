const LocalStrategy = require("passport-local");
const User = require("../Model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../Middleware/Services");
// =======================================

exports.PassportAuthentication = (passport) => {
  // passport strategies

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email", // replace 'username' with 'email'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, { message: "no such user email" });
          }
          crypto.pbkdf2(
            password,
            user.salt,
            310000,
            32,
            "sha256",
            async (err, hashedPassword) => {
              if (crypto.timingSafeEqual(user.password, hashedPassword)) {
                return done(null, sanitizeUser(user)); // this line send to serializer
              } else {
                return done(null, false, {
                  message: "Incorrect email or password",
                });
              }
            }
          );
        } catch (error) {
          return done(error); // Pass the error object to the done function
        }
      }
    )
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
