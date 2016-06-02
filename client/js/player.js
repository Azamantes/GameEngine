'use strict';

class Player extends Channel {
	constructor(name, nodes) {
		super();
		this.name = name;
		// --------------------
		// WEBSOCKET
		// --------------------
		this.websocket = new WebSocket('ws://localhost:8080');
		this.websocket.onopen = this.websocketOpen.bind(this);
		this.websocket.onmessage = this.websocketMessage.bind(this);
		this.websocket.onclose = this.websocketClose;
		this.websocket.sendJSON = function(data){
			this.send(JSON.stringify(data));
		};

		this.send = this.websocket.sendJSON.bind(this.websocket);
		
		new DragDrop(this, this.send);
		new Stats(this, this.send, nodes.stats);
		new Inventory(this, nodes.inventory);
		new Equipment(this, nodes.equipment);
		new Chat(this, this.send, {
			root: nodes.chat,
			input: nodes.chatInput,
		});


		// const dragger = new DragDrop(this, this.send);
		// const stats = new Stats(this, this.send, nodes.stats);
		// const inventory = new Inventory(this, nodes.inventory);
		// const equipment = new Equipment(this, nodes.equipment);
		// const chat = new Chat(this, this.send, {
		// 	root: nodes.chat,
		// 	input: nodes.chatInput,
		// });
	}
	websocketOpen(){
		console.log('Websocket is open.');
		this.send({
			event: 'connect',
			config: {
				user: USER_ID,
				character: CHARACTER_ID,
			}
		});
	}
	websocketMessage(object) {
		const data = JSON.parse(object.data);
		this.shout(`ws: ${data.event}`, data.data);
	}
	websocketClose() {
		window.location.href = window.location.href;
	}
}