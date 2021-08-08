require('dotenv').config();

const tmi = require('tmi.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
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
});

server.listen(port, function(){
    console.log('app running');
});

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_USER;
	// "Alca: Hello, World!"
    console.log(`${tags['display-name']}: ${message}`);
    let newMessage = `${tags['display-name']}: ${message}`;
    if (currentChat.length == 50) {
        currentChat = [];
    }
    currentChat.push(newMessage);
    if (isNotBot) return;
    if (message.toLowerCase() == "!ping") {
        client.say(channel, `I'm up and running! potubbHype`);
    }
});

client.on("subscription", (channel, username, method, message, userstate) => {
    client.say(channel, `potubbGG THANKS FOR THE SUB ${username}! potubbHype`);
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    client.say(channel, `potubbGG WELCOME BACK ${username} THANKS FOR ${months} potubbHype potubbHype`);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    client.say(channel, `potubbGG ${recipient} MAKE SURE TO THANK ${username} FOR THE GIFTED SUB potubbHype`);
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    client.say(channel, `potubbGG THANKS FOR THE GIFTED SUB ${username} potubbHype`);
});

client.on("cheer", (channel, userstate, message) => {
    if (userstate.bits == 1) {
        client.say(channel, `PogChamp THANKS FOR THE ${userstate.bits} BIT ${userstate.username} potubbHype`);
    } else {
        client.say(channel, `PogChamp THANKS FOR THE ${userstate.bits} BITS ${userstate.username} potubbHype`);
    }
});