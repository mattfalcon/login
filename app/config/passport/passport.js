//FILE CONTAINS PASSPORT STRATEGIES
  //load bcrypt to secure passwords
  var bCrypt = require('bcrypt-nodejs');
//module exports block
  module.exports = function(passport,user){
//initialize passport-local strategy and user model
  var User = user;
  var LocalStrategy = require('passport-local').Strategy;


//===============================================
//------------SERIALIZE FUNCTIONS----------------
//=============================================
//// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
//Serialize saves uder id to the session
  passport.serializeUser(function(user, done) {
          done(null, user.id);
      });
// used to deserialize the user
//we use the Sequelize findById promise to get the user and an instance of the Sequelize model is returned. 
//To get the User object from this instance, we use the Sequelize getter function like this: user.get()
  passport.deserializeUser(function(id, done) {
      User.findById(id).then(function(user) {
        if(user){
          done(null, user.get());
        }
        else{
          done(user.errors,null);
        }
      });

  });
//----------------------------------------------------------


//define custom strategy with instance of localstrategy
//declared req fields usernameField & passwordField (passport variables) are
  passport.use('local-signup', new LocalStrategy(
    {           
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
 //callback function 
    function(req, email, password, done){
       //handles storing users details
       //hashed password generating function inside callback
      var generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      //sequelize user model initialized earlier as user to check if user exists
       User.findOne({where: {email:email}}).then(function(user){
      if(user)
      {
        return done(null, false, {message : 'That email is already taken'} );
      }
      else
      {
        var userPassword = generateHash(password);
        var data =
        { email:email,
        password:userPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname
        };
//user.create is a sequelize method for adding new entries to the database 
//values from data object are received from the req.body object which contains the input from signup group
        User.create(data).then(function(newUser,created){
          if(!newUser){
            return done(null,false);
          }
          if(newUser){
            return done(null,newUser);           
          }
        });
      }
    }); 
  }
  ));
  
  //===============================================================================
  //LOCAL SIGNIN
  //===============================================================================
  //// The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  //In this strategy, the isValidPassword function...................
  //compares the password entered with the bCrypt comparison method since we stored our password with bcrypt.
  passport.use('local-signin', new LocalStrategy(
  {
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    var User = user;
    var isValidPassword = function(userpass,password){
      return bCrypt.compareSync(password, userpass);
    }
    User.findOne({ where : { email: email}}).then(function (user) {
      if (!user) {
        return done(null, false, { message: 'Email does not exist' });
      }
      if (!isValidPassword(user.password,password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      var userinfo = user.get();
      return done(null,userinfo);
    }).catch(function(err){
      console.log("Error:",err);
      return done(null, false, { message: 'Something went wrong with your Signin' });
    });
  }
  ));

  }
