var exports = module.exports = {}

//controller for signup route 
exports.signup = function(req,res){
	res.render('signup'); 
}

//added controller for sign in
exports.signin = function(req,res){
	res.render('signin'); 
}

exports.dashboard = function(req,res){

	res.render('dashboard'); 

}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/');
  });

}