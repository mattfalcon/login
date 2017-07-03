//==============================================
//---------DEPENDENCIES------------------------
//=============================================

  //assigns express module to a variable express
    var express    = require('express')
  //initialize express and name it a variable app
    var app        = express()
  //needed to handle authentication
    var passport   = require('passport')
    var session    = require('express-session')
  //extracts the body part of incoming request and puts in workable format (JSON)
    var bodyParser = require('body-parser')
    var env        = require('dotenv').load()
    //import handlebars for views
    var exphbs     = require('express-handlebars')


//================APP.USE===================================
    //For BodyParser use
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());


     // For Passport initialize and middleware
    app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions


//=================HANDLEBARS=================================
     //For Handlebars
    app.set('views', './app/views')
    app.engine('hbs', exphbs({extname: '.hbs'}));
    app.set('view engine', '.hbs');
    

//call the app.get express routing function 
    app.get('/', function(req, res){
	  res.send('Welcome to Passport with Sequelize');
	});


	//Import models we place in the models folder 
    var models = require("./app/models");


    //Routes to import route in server.js and pass app/passport as an argument
    var authRoute = require('./app/routes/auth.js')(app,passport);


    //load passport strategies
    require('./app/config/passport/passport.js')(passport,models.user);


    //Sync Database through sequelize
   	models.sequelize.sync().then(function(){
    console.log('You are sequelized')

    }).catch(function(err){
    console.log(err,"Something is wrong")
    });


//make app listen on port 5000
	app.listen(5000, function(err){
		if(!err)
		console.log("Site is live"); else console.log(err)

	});



    