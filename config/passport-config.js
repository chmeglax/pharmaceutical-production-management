const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./database');

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};
//const User = connection.models.User;

/*function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
    
  }*/
  const verifyCallback = (email, password, done) => {
    const user = User.findOne({ email: email })
    .then(async (user) => {

      if (user == null) {
        return done(null, false, { message: 'No user with that email' })
      }
      
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
  })


    

   

}

  passport.use(new LocalStrategy(customFields, verifyCallback))
  passport.serializeUser((user, done) => done(null, user.id))
  /*passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })*/

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
//}

//module.exports = initialize