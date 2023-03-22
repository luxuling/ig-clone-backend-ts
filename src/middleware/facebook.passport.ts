import { Strategy as FacebookStrategy } from 'passport-facebook';
import facebookAuthConf from '@config/fb';
import passport from 'passport';

passport.use(
  new FacebookStrategy(
    {
      clientID: facebookAuthConf.FACEBOOK_CLIENT_ID,
      clientSecret: facebookAuthConf.FACEBOOK_SECRET,
      callbackURL: facebookAuthConf.FACEBOOK_CALLBACK_URL,
    },
    (async (accessToken, refreshToken, profile, cb) => {
      cb(null, {
        accessToken,
        refreshToken,
        profile,
      });
    }),
  ),
);

passport.serializeUser((data: any, done) => {
  done(null, data.profile.id);
});

export default passport;
