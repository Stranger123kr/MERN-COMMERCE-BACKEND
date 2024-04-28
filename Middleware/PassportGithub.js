const User = require("../Model/User");
const GitHubStrategy = require("passport-github2").Strategy;
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

exports.PassportGithubAuthentication = (passport) => {
  // passport strategies

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          "https://mern-commerce-backend-64fw.onrender.com/auth/github/callback",
        scope: ["profile", "email"],
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ socialMediaId: profile.id });

          if (!user) {
            user = new User({
              socialMediaId: profile.id,
              name: profile.username,
              image: profile._json.avatar_url,
              email: profile._json.email || "Not Present",
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
