const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const db = require("./database");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isValid = await User.validatePassword(password, user.password);
      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [user] = await db.execute(
      "SELECT id, username FROM users WHERE id = ?",
      [id]
    );
    done(null, user[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
