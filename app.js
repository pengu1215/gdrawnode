var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

var send;
io.sockets.on('connection', function(socket){   
    
    console.log('*user '+socket.id+' connected');
    
    socket.on('send1', function (data) {
        var temp = JSON.parse(data);
        send = {'id':temp.id, 'type':temp.type, 'px': temp.px, 'py':temp.py, 'x': temp.x, 'y':temp.y, 
                 'color':temp.color, 'weight':temp.weight};
        console.log(send);
        socket.broadcast.emit('moving1', send);
    });
    
    socket.on('send2', function (data) {
        var temp = JSON.parse(data);
        send = {'id':temp.id, 'type':temp.type, 'px': temp.px, 'py':temp.py, 'x': temp.x, 'y':temp.y, 
                 'color':temp.color, 'weight':temp.weight};
        console.log(send);
        socket.broadcast.emit('moving2', send);
    });
    
    socket.on('delete', function (id) { //data=id
        console.log("delete // ", id);
        socket.broadcast.emit('erasing', id);
    });
    
    socket.on('connect_failed', function(){
        console.log('*user '+socket.id+' Connection Failed');
    });
    
    socket.on('connect_error', function(){
        console.log('*user '+socket.id+' Connection Error');
    });
    
    socket.on('error', function(){
        console.log('*user '+socket.id+' Error');
    });
    
    socket.on('disconnect', function () {
        console.log('*user '+socket.id+' Disconnected');
    })    
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
