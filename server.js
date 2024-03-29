require('dotenv').config();

const tmi = require('tmi.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
const translate = require("translate");

let currentChat = [];


const client = new tmi.Client({
    connection: {
        reconnect: true
    },
	channels: [ 'parkerfries' ],
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

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
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
        client.say(channel, `I'm up and running! parker142Logo parker142LOVE`);
    }
});

client.on("subscription", (channel, username, method, message, userstate) => {
    client.say(channel, `parker142LOVE_HF THANKS FOR THE SUB ${username}! parker142LOVE`);
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    client.say(channel, `parker142LOVE_HF WELCOME BACK ${username} THANKS FOR ${months} parker142LOVE`);
});

client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    client.say(channel, `parker142LOVE_HF ${recipient} MAKE SURE TO THANK ${username} FOR THE GIFTED SUB parker142LOVE`);
});

client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    client.say(channel, `parker142LOVE_HF THANKS FOR THE GIFTED SUB ${username} parker142LOVE`);
});

client.on("cheer", (channel, userstate, message) => {
    if (userstate.bits == 1) {
        client.say(channel, `parker142LOVE_HF THANKS FOR THE ${userstate.bits} BIT ${userstate.username} parker142LOVE`);
    } else {
        client.say(channel, `parker142LOVE_HF THANKS FOR THE ${userstate.bits} BITS ${userstate.username} parker142LOVE`);
    }
});