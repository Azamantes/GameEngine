'use strict';

const DEBUG = true;

// --------------
// SERVER CONFIG
// --------------

const WebsocketServer = require('ws').Server;
const server = new WebsocketServer({
	port: 8080
});

const database = require('mysql').createConnection({
	host: '192.168.97.100',
	user: 'user',
	password: '',
	database: 'gameengine',
	multipleStatements: true,
});
database.connect();

// ------------------
// CREATE GAME WORLD
// ------------------
const World = require('./engine/world.js');
const Setup = require('./user.js');
const User = Setup.User;
Setup.Init(new World(database)); // database is in the world.js file since Game World is the only object doing queries.


// -------------------
// HANDLE CONNECTIONS
// -------------------
server.on('connection', userConnection);

function userConnection(ws) {

	log('Nowe polaczenie: ' + ws.upgradeReq.connection.remoteAddress);


	const user = new User({ socket: ws });

	ws.on('message', user.handleMessage.bind(user));
	ws.on('close', (a, b) => {
		user.disconnect();
	});
}

function log(string) {
	if(DEBUG) {
		console.log(string);
	}
}