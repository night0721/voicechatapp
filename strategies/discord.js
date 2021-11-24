const uuid = require("uuid");
const passport = require("passport");
const { Strategy } = require("passport-discord");
const db = require("../models/user");
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (obj, done) => {
  const user = await db.findOne({ id: obj });
  if (user) done(null, user);
});
passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, username, email, avatar } = profile;
      const data = await db.findOne({ username });
      if (data) done(null, data);
      else {
        const ndb = {
          id: uuid.v4(),
          username,
          email,
          avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
        };
        const nd = new db(ndb).save();
        done(null, nd);
      }
    }
  )
);
