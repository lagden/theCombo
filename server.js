var express = require('express'),
    app = module.exports = express(),
    cons = require('consolidate'),
    swig = require('swig'),
    port = process.env.PORT || 5000;

app.engine('.html', cons.swig);
app.set('view engine', 'html');
app.set('view options', {
    layout: false
});
app.set('view cache', false);
app.set('views', __dirname + '/views');

swig.init({
    allowErrors: true,
    encoding: 'utf8',
    root: '/'
});

app.configure(function(){
    app.use(express.static(__dirname + '/'));
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.render('page.html', {title: 'Basic Example - theCombo'});
});

app.listen(port, function() {
    console.log("Express app started on port %d", port);
});
