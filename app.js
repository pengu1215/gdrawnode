var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var send;
io.sockets.on('connection', function(socket){   
    
    socket.on('send', function (data) {
        var temp = JSON.parse(data);
        send = {'id':temp.id, 'type':temp.type, 'x': temp.x, 'y':temp.y, 'color':temp.color, 'weight':temp.weight, 'drawing': temp.drawing};
        console.log(send);
        socket.broadcast.emit('moving', send);
    });
    
    socket.on('delete', function (id) { //data=id
        console.log("delete // ", id);
        socket.broadcast.emit('erasing', id);
    });
    
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;