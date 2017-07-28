var express = require("express");
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

// route functions
var blog_functions = require('./logic/blog.js');
var user_functions = require('./logic/user.js');

// webservice
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
app.listen(port);

var istokenvalid = false;

var apiRoutes = express.Router();

apiRoutes.use(bodyParser.urlencoded({extended: true}));
apiRoutes.use(bodyParser.json());

apiRoutes.put('/login', function (req, res) {
    user_functions.login(req, res);
});

apiRoutes.use(function (req, res, next) {
    // check params
    var token = req.body.token || req.headers['x-access-token'];
    // if jwt
    if (token) {
        jwt.verify(token, 'sicherespasswort', function (err, decoded) {
            if (err) {
                istokenvalid = false;
                next();
            } else {
                req.decoded = decoded;
                istokenvalid = true;
                next();
            }
        });
    } else {
        istokenvalid = false;
        next();
    }
});

//Changing Password
apiRoutes.put('/passwordRecovery', function (req, res) {
    user_functions.passwordRecovery(req, res, istokenvalid);
});

//all Blogentries
apiRoutes.get('/blog/', function (req, res) {
    blog_functions.showall(req, res, istokenvalid);
});

//specific Blogentry
apiRoutes.get('/blog/:id', function (req, res) {
    blog_functions.showone(req, res, istokenvalid);
});

// delete Blogentry
apiRoutes.delete('/blog/:id', function (req, res) {
    blog_functions.deletepost(req, res, istokenvalid);
});

//update Blogentry
apiRoutes.put('/blog/:id', function (req, res) {
    blog_functions.updatepost(req, res, istokenvalid);
});

// create Blogentry
apiRoutes.post('/blog', function (req, res) {
    blog_functions.createpost(req, res, istokenvalid);
});

// Diesen Pfad als Hauptroute der API nutzen
app.use('/api/V1', apiRoutes);
