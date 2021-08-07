require('dotenv').config();

const tmi = require('tmi.js');

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

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_USER;
	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
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