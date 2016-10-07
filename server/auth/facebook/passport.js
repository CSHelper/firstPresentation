import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('\n\n\n\n fuck');
    User.find({where: {'facebookId': profile.id}})
      .then(user => {
        console.log('\n\n\n\n find');
        if(user) {
          return done(null, user);
        }
        console.log('\n\n\n\n prebuild');
        user = User.build({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebookId: profile.id,
          json: profile._json
        });
        
        user.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
