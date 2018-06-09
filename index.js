// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var server = require("http").Server(app);
app.set('port', (process.env.PORT || 3000));//define el puerto una vez subido a heroku

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var formData = require("express-form-data");//permite leer archivos en nuestra aplicación
var methodOverride = require("method-override");//sirve para utilizar otros metodos http que no implemeta el navegador como lo son put, delete ect
var session      = require('express-session');
var validator = require("express-validator");
var path = require("path");
//var validatorHelper = require("express-validation-helper");

//all routes
var indexRoute = require("./routes/index");
var userRoute = require("./routes/user");
var materieprimeRoute = require("./routes/materieprime");
var staffRoute = require("./routes/staff");
var bodega_principalRoute = require("./routes/bodega_principal");
/*var registerRoute = require("./routes/registro");*/

var sessionMiddleware = require("./middlewares/session");

var configDB = require('./config/database.js');
require('./config/passport')(passport);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//mongoose.connect("mongodb://admin:admin@ds133360.mlab.com:33360/barberia");
// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms
app.use(validator());// debe ir siempre debajo del cuerpo que es el que se va a anlizar
//app.use(validatorHelper());
app.use(methodOverride("_method"));//_method es el nombre con que identificara los campos o input para poder ser enviados y renocidos en el proyecto para los metodos put y delete
app.use(formData.parse({keepExtensions:true,}));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use("/public",express.static("public"));//la función stactica es para archivos que no cambien como los css,js etcc en este caso buscara en public pero puede ser en otra carpeta
app.use("/view",express.static("view"));
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req,res,next){
	//login es el nombre de la variable
	// esto nos permitira utilizar esta variable en
	// todas nuestras vistas dado el caso de que se este autenticado
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session; // ahora la session se podra manejar en las vistas
	next();
})
// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./routes/index')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use("/app", sessionMiddleware);
app.use("/app", materieprimeRoute);
app.use("/app", staffRoute);
app.use("/app", bodega_principalRoute);
//app.use("/app", registerRoute);


// launch ======================================================================
//server.listen(app.get('port'),"192.168.0.30");
server.listen(app.get('port'));
