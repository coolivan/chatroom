var express = require('express');
var app = express();
var fs = require('fs');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(express.static('./public'));

var users = [];

app.get('/',function (req,res,next) {
    res.render('index');
});

app.get('/login',function (req,res,next) {
    var name = req.query.name;
    if(!name){
        res.send('必须填写用户名');
        return;
    }
    if(users.indexOf(name) != -1){
        res.send('用户名已被占用');
        return;
    }
    users.push(name);
    req.session.name = name;
    res.redirect('/chat');
});

app.get('/chat',function (req,res,next) {
    if(!req.session.name){
        res.redirect('/');
        return;
    }
    res.render('chat',{
        'name':req.session.name,
    })
});





io.on("connection",function(socket){
    socket.on("content",function(msg){
        io.emit("content",msg);

    });
});



http.listen(3000);//注意这里要用http，不能用app