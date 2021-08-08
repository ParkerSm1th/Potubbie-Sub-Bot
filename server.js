require('dotenv').config();

const tmi = require('tmi.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const path = require('path');

let currentChat = [];


const client = new tmi.Client({
    connection: {
        reconnect: true
    },
	channels: [ 'potubbie' ],
    identity: {
		username: process.env.TWITCH_USER,
		password: process.env.TWITCH_TOKEN
	},
});

client.connect();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

app.get('/chat', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('chat', {chat: currentChat});
});


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
      socket.on('twitch_event', function(msg){
        console.log('twitch_event: ' + msg);
      });
});

server.listen(port, function(){
    console.log('app running');
});


io.on("connection", (socket) => {

    client.on('message', (channel, tags, message, self) => {
        const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_USER;
        // "Alca: Hello, World!"
        console.log(`${tags['display-name']}: ${message}`);
        let newMessage = `${tags['display-name']}: ${message}`;
        if (currentChat.length == 50) {
            currentChat = [];
        }
        currentChat.push(newMessage);
        io.emit('twitch_event', newMessage);
        if (isNotBot) return;
        if (message.toLowerCase() == "!ping") {
            client.say(channel, `I'm up and running! potubbHype`);
        }
    });
  
    client.on("subscription", (channel, username, method, message, userstate) => {
        client.say(channel, `potubbGG THANKS FOR THE SUB ${username}! potubbHype`);
        io.emit('twitch_event', "sub event here")
    });

    client.on("resub", (channel, username, months, message, userstate, methods) => {
        client.say(channel, `potubbGG WELCOME BACK ${username} THANKS FOR ${months} potubbHype potubbHype`);
        io.emit('twitch_event', "sub event here")
    });

    client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
        client.say(channel, `potubbGG ${recipient} MAKE SURE TO THANK ${username} FOR THE GIFTED SUB potubbHype`);
        io.emit('twitch_event', "sub event here")
    });

    client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
        client.say(channel, `potubbGG THANKS FOR THE GIFTED SUB ${username} potubbHype`);
        io.emit('twitch_event', "sub event here")
    });

    client.on("cheer", (channel, userstate, message) => {
        if (userstate.bits == 1) {
            client.say(channel, `PogChamp THANKS FOR THE ${userstate.bits} BIT ${userstate.username} potubbHype`);
        } else {
            client.say(channel, `PogChamp THANKS FOR THE ${userstate.bits} BITS ${userstate.username} potubbHype`);
        }
        io.emit('twitch_event', "sub event here")
    });

});