const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./database");
var connection = require("./dbConfig");

const customFields = {
  usernameField: "email",
  passwordField: "password",
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
  connection.query(
    "SELECT * FROM user WHERE email='" + email + "'",
    async function (error, rows) {
      if (error) return done(null, false, { message: error });
      if (!rows.length) {
        return done(null, false, { message: "No user with that email" });
      }

      try {
        if (await bcrypt.compare(password, rows[0].pwd)) {
          return done(null, rows[0]);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (e) {
        return done(e);
      }
    }
  );

  /*const user = User.findOne({ email: email })
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
*/
};

passport.use(new LocalStrategy(customFields, verifyCallback));

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
const signUpFileds = {
  // by default, local strategy uses username and password, we will override with email
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true, // allows us to pass back the entire request to the callback
};

passport.use(
  "local-signup",
  new LocalStrategy(signUpFileds, function (req, email, password, done) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists

    connection.query(
      "select * from user where email = '" + email + "'",
      async function (err, rows) {
        if (err) return done(err);
        if (rows.length) {
          return done(null, false, {
            message: "That email is already taken.",
          });
        } else {
          // if there is no user with that email
          // create the user
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          var newUserMysql = new Object();

          newUserMysql.position = req.body.position;
          newUserMysql.position = req.body.name;
          newUserMysql.department = req.body.department;
          newUserMysql.phone = req.body.phone;
          newUserMysql.site = req.body.site;
          newUserMysql.access = req.body.type;
          newUserMysql.phone = req.body.phone;
          newUserMysql.email = email;
          newUserMysql.password = hashedPassword; // use the generateHash function in our user model

          var sql =
            "INSERT INTO `user` (`position`, `name`, `phone`, `email`, `pwd`, `department`, `state`, `site_id`, `access`) \
            VALUES (?,?,?,?,?,?,'active',?,?);";
          connection.query(
            sql,
            [
              req.body.position,
              req.body.name,
              req.body.phone,
              email,
              hashedPassword,
              req.body.department,
              req.body.site,
              req.body.type,
            ],
            function (error, rows) {
              newUserMysql.id = rows.insertId;
              return done(null, false, {
                message: "Account created",
              });
            }
          );
        }
      }
    );
  })
);

passport.serializeUser((user, done) => done(null, user.id));
/*passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })*/

passport.deserializeUser(function (id, done) {
  connection.query("select * from user where id = " + id, function (err, rows) {
    done(err, rows[0]);
  });
});
//}

//module.exports = initialize
