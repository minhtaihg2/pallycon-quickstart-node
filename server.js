var express = require('express');
var app = express();
var bodyParser = require('body-parser');
/*
var session = require('express-session');
var fs = require("fs");
*/

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var CORS = require('cors')();
app.use(CORS);

/*
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));


var router = require('./router/main')(app, fs);
*/

var makeDrm = require('./logics/makeDrmData');
var packager = require('./logics/packagerIntegration');
var issueCID = require('./logics/CIDIssue');
var rightsInfo = require('./logics/ContentUsageRightsInfo');

var router = express.Router();

/*
// route middleware that will happen on every request
router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
});

// route middleware to validate :name
router.param('userid', function(req, res, next, name) {
    // do validation on name here
    // blah blah validation
    // log something so we know its working
    console.log('doing userID validations on ' + userid);

    // once validation is done save the new item in the req
    req.userid = userid;
    // go to the next thing
    next();
});
*/

// home page route (http://localhost:3000)
router.get('/', function(req, res) {
    res.render('index', {
        makeDrm: makeDrm
    });
});

/*
router.post('/', function(req, res) {
    console.log('req body: ' + req.body);
    res.render('index', {
        data: req.body,
        makeDrm: makeDrm
    });
});
*/

router.get('/pack', function(req, res) {
    res.render('pack', {
        data: 0,
        makeDrm: makeDrm,
        packager: packager
    });
});

router.post('/pack', function(req, res) {
    console.log('req body: ' + req.body);
    res.render('pack', {
        data: req.body,
        makeDrm: makeDrm,
        packager: packager
    });
});

router.get('/config', function(req, res) {
    res.render('config', {
        data: 0,
        makeDrm: makeDrm
    });
});

router.post('/config', function(req, res) {
    console.log('req body: ' + req.body);
    res.render('config', {
        data: req.body,
        makeDrm: makeDrm
    });
});

router.post('/CIDIssue', function(req, res) {
    console.log('req data: ' + req.body.data);
    res.send(issueCID.makeRes(req.body.data));
});

router.post('/ContentUsageRightsInfo', function(req, res) {
    console.log('req data: ' + req.body.data);
    res.send(rightsInfo.makeRes(req.body.data));
});


// apply the routes to our application
app.use('/', router);

var port = process.env.PORT || process.env.HTTP_PORT || 8080;
var server = app.listen(port, function() {
    console.log("Express server has started on port " + server.address().port);
});
