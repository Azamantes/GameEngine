class Player {
	constructor(config) {
		this.name = config.name;
		// // --------------------
		// // WEBSOCKET
		// // --------------------
		this.chatNode = config.chatNode;
		this.websocket = new WebSocket('ws://192.168.97.100:8080');
		this.dragger = new DragDrop(this.websocket);
		this.websocket.sendJSON = function(data){
			this.send(JSON.stringify(data));
		};
		this.websocket.onopen = this.websocketOpen.bind(this);
		this.websocket.onmessage = this.websocketMessage.bind(this);
		this.websocket.onclose = this.websocketClose;

		this.inventory = new Inventory(config.inventory);
		this.equipment = new Equipment(config.equipment);
		// this.equipment = null; // new Equipment(config.equipment);
		
		// this.dragger = new DragDrop();

		this.events = {
			chat: this.chatWrite.bind(this),
			equipment: this.equipmentInit.bind(this),
			inventory: this.inventoryInit.bind(this),
		};
	}
	websocketOpen(){
		console.log('Websocket is open.');
		this.websocket.sendJSON({
			event: 'connect',
			config: {
				user: USER_ID,
				character: CHARACTER_ID,
			}
		});
	}
	websocketMessage(object) {
		const data = JSON.parse(object.data);
		this.chatWrite(data.message);
		// console.log(data.data);
		// const [header, tail] = this.getEventHeader(data.event);
		// this.handleEventHeader(header, tail, data);
		this.events[data.event] && this.events[data.event](data.data);
	}
	websocketClose() {
		window.location.href = window.location.href;
	}
	// -------------------
	// INTERFACE
	// -------------------
	// getEventHeader(string) {
	// 	return string.slice(0, string.indexOf(':'));
	// }
	// handleEventHeader(header, tail, object) {
	// 	if(!header) return;
	// 	switch(header) {
	// 		case 'location': {
	// 			this.location.handleEvent(tail, object)
	// 			break;
	// 		}
	// 	}
	// }
	chatWrite(value) {
		const element = doc.createElement('div');
		element.textContent = value;
		this.chatNode.appendChild(element);
	}
	equipmentInit(object) {
		console.log(object);
		this.equipment.slots = object;
		// this.inventory.reload();
		this.equipment.init();
		this.dragger.bindNode(this.equipment.root);
	}
	inventoryInit(object) {
		console.log(object);
		this.inventory.slots = object;
		// this.inventory.reload();
		this.inventory.init();
		this.dragger.bindNode(this.inventory.root);
	}
	itemMove() {
		
	}
}