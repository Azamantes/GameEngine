'use strict';

const DEBUG = true;

// --------------
// SERVER CONFIG
// --------------

const WebsocketServer = require('ws').Server;
const server = new WebsocketServer({
	// ssl: true,
	port: 8080,
	// ssl_key: '/xampp/apache/conf/ssl.key/server.key',
	// ssl_cert: '/xampp/apache/conf/ssl.crt/server.crt',
});

const database = require('mysql').createConnection({
	// host: '127.0.0.1',
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
const Game = new World(database);

const {Init, User} = require('./user.js');
Init(Game); // database is in the world.js file since Game World is the only object doing queries.


// -------------------
// HANDLE CONNECTIONS
// -------------------
server.on('connection', userConnection);

function userConnection(ws) {
	log('Nowe polaczenie: ' + ws.upgradeReq.connection.remoteAddress);

	const user = new User({
		socket: ws,
		world: Game,
	});

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