var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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

var makeDrm = require('./logics/makeDrmData');
var issueCID = require('./logics/CIDIssue');
var rightsInfo = require('./logics/ContentUsageRightsInfo');

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', {
        makeDrm: makeDrm
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
