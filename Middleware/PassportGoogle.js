const User = require("../Model/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { sanitizeUser } = require("./Services");
// =======================================

// random Password Generator

const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

// =======================================

exports.PassportGoogleAuthentication = (passport) => {
  // passport strategies

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          "https://mern-commerce-backend-64fw.onrender.com/auth/google/callback",
        scope: ["profile", "email"],
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              image: profile.photos[0].value,
              email: profile.emails[0].value,
              password: generatePassword(30),
              salt: generatePassword(30),
            });
            await user.save();
          }

          return done(null, sanitizeUser(user)); // this line send to serializer
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error, false);
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
