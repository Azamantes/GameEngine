// class User {
// 	constructor() {

// 	}
// 	addMessage(value) {
// 		const element = doc.createElement('div');
// 		element.textContent = value;
// 		this.messageCenter.appendChild(element);
// 	}
// 	inventory(data) {
// 		let slotNumber, item;
// 		const inventory = doc.get('inventory');
// 		const object = data.data;
// 		let itemID;
// 		Object.keys(object).map(slotNumber => {
// 			itemID = object[slotNumber].id;
// 			item = doc.createElement('img');
// 			item.src = './' + object[itemID].img;
// 			item.id = 'item#' + itemID;
// 			doc.get('inv-item#' + slotNumber).appendChild(item);
// 			// inventory.children[~~(itemID / 10)] // get row
// 			// 	.children[itemID % 10 - 1] // get table cell in that row
// 			// 	.appendChild(item); // put item in it
// 		});
// 	}
// };

const doc = document;
doc.get = doc.getElementById;

// // --------------------
// // INVENTORY (CREATE)
// // --------------------
// (function(){
// 	const tr = document.createElement('tr');
// 	const td = document.createElement('td');
// 	const fragment = document.createDocumentFragment();
// 	const max = 10;
// 	let x = -1;
// 	let y, row, cell;

// 	while(++x < 10) { // add new row
// 		y = -1;
// 		row = tr.cloneNode();
// 		while(++y < 10) { // populate row with cells
// 			cell = td.cloneNode();
// 			cell.setAttribute('id', 'inv-item#' + (10 * x + 1 + y));
// 			row.appendChild(cell);
// 		}
// 		fragment.appendChild(row);
// 	}

// 	doc.get('inventory').appendChild(fragment);
// }());

// // --------------------
// // WEBSOCKET
// // --------------------
// const websocket = new WebSocket('ws://192.168.97.100:8080');
// WebSocket.prototype.sendJSON = function(data){
// 	this.send(JSON.stringify(data));
// };
// websocket.onopen = function(){
// 	console.log('Websocket is open.');
// 	websocket.sendJSON({
// 		event: 'connect',
// 		config: {
// 			user: USER_ID,
// 			character: CHARACTER_ID,
// 		}
// 	});
// };
// websocket.onmessage = function(object){
// 	const data = JSON.parse(object.data);
// 	user.addMessage(data.message);
// 	// console.log(data.event);
// 	// if(data.event === 'inventory') {
// 	// 	console.log(!!user);
// 	// }
// 	user[data.event] && user[data.event](data);
// };
// websocket.onclose = function() {
// 	window.location.href = window.location.href;
// };

// // --------------------
// // USER
// // --------------------
// const user = new User();
// User.prototype.messageCenter = doc.get('messages');

// // --------------------
// // DOM EVENTS
// // --------------------
// window.addEventListener('beforeunload', function(){
// 	websocket.close();
// });
doc.get('logout').addEventListener('click', function(event) {
	event.preventDefault();
	window.location.href = 'logout.php';
});



const player = new Player({
	name: 'Player#1',
	inventory: {
		root: doc.get('table-inventory'),
		// slots: {
		// 	1: { id: 'item#123123', src: 'sword2.png' },
		// },
	},
	equipment: {
		root: doc.get('table-equipment'),
		// slots: {
		// 	head: { id: 'item#123', src: 'sword3.png' },
		// 	'hand-left': { id: 'item#1323', src: 'sword5.png' },
		// 	'hand-right': { id: 'item#13323', src: 'sword4.png' },
		// },
	},
	chatNode: doc.get('chat')
});