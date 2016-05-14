// const Game = new World();

// Locations
// const l1 = Game.createLocation({ name: 'Wioska' });
// const l2 = Game.createLocation({ name: 'Miasto' });

// Players
// const p1 = Game.createPlayer({ id: 1, name: 'Zenek', location: 1, team: null, guild: 0 });
// const p2 = Game.createPlayer({ id: 2, name: 'Edek', location: 1, team: null, guild: 0 });

// console.time('start');
// var i = 1e1;
// while(--i + 1) {
// 	Game.createPlayer({ id: i, name: 'Player#' + i, location: 1, team: null, guild: 0 });
// }
// console.timeEnd('start');

// p1.createTeam({ type: false });
// p2.joinTeam(p1);
// p1.changeTeamType(true);
// p1.kickOutFromTeam(p2);

// p1.enterLocation(2);
// p2.enterLocation(2);

// -----------------
// ALIASES
// -----------------
// (function (){
WebSocket.prototype.sendJSON = function(data){
	this.send(JSON.stringify(data));
};


const doc = document;
doc.get = doc.getElementById;

class User {
	constructor() {

	}
	addMessage(value) {
		const element = doc.createElement('div');
		element.textContent = value;
		this.messageCenter.appendChild(element);
	}
	inventory(data) {
		let slotNumber, item;
		const inventory = doc.get('inventory');
		const object = data.data;

		Object.keys(object).map(itemID => {
			slotNumber = object[itemID].nr;
			console.log(slotNumber);
			item = doc.createElement('img');
			item.src = './' + object[itemID].img;
			item.id = 'item#' + itemID;
			inventory.children[~~(itemID / 10)] // get row
				.children[itemID % 10 - 1] // get table cell in that row
				.appendChild(item); // put item in it
		});

	}
};
User.prototype.messageCenter = doc.get('messages');
const user = new User();




const websocket = new WebSocket('ws://127.0.0.1:8080');
websocket.onopen = function(){
	console.log('Websocket is open.');
	websocket.sendJSON({
		event: 'connect',
		config: {
			user: USER_ID,
			character: CHARACTER_ID,
		}
	});
};
websocket.onmessage = function(object){
	const data = JSON.parse(object.data);
	user.addMessage(data.message);
	// console.log(data.event);
	// if(data.event === 'inventory') {
	// 	console.log(!!user);
	// }
	user[data.event] && user[data.event](data);
};
websocket.onclose = function() {
	window.location.href = window.location.href;
};



window.addEventListener('beforeunload', function(){
	websocket.close();
});
doc.get('logout').addEventListener('click', function(event) {
	event.preventDefault();
	window.location.href = 'logout.php';
});
// }());