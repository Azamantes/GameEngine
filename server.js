'use strict';

// --------------
// SERVER CONFIG
// --------------
const WebsocketServer = require('ws').Server;
const server = new WebsocketServer({
	port: 8080
});

// ------------------
// CREATE GAME WORLD
// ------------------
const World = require('./engine/world.js');
const Setup = require('./user.js');
const User = Setup.User;
Setup.Init(new World());


// -------------------
// HANDLE CONNECTIONS
// -------------------
server.on('connection', userConnection);

function userConnection(ws) {
	const user = new User({ socket: ws });

	ws.on('message', user.handleMessage.bind(user));
	ws.on('close', (a, b) => {
		user.disconnect();
	});
}