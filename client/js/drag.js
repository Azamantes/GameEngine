class DragDrop {
	constructor(ws) {
		this.websocket = ws;
		this.element = null;
		this.elementParent = null;
		this.eqSlotList = ['head', 'ring1', 'ring2', 'neck', 'chest',
			'hand-left'.replace(/\-/, '\\-'),
			'hand-right'.replace(/\-/, '\\-'),
			'palms', 'legs', 'waist', 'feet'
		];
		this.regexp = new RegExp('(inv#[0-9]+)|(eq#(' + this.eqSlotList.join('|') + '))', '');
		this.targetString = 'TDIMG';

		this.queue = [];
	}
	bindNode(node) {
		node.addEventListener('dragstart', this.drag.bind(this));
		node.addEventListener('dragover', this.allow.bind(this));
		node.addEventListener('drop', this.drop.bind(this));
	}
	clear() {
		this.element = null;
		this.elementParent = null;
	}
	allow(event) {
		event.preventDefault();
	}
	drag(event) {
		const target = event.target.tagName === 'IMG';
		const parentID = event.target.parentNode.id;
		const regexp = this.regexp;

		if(!target || !regexp.test(parentID)) {
			return console.log('Nie jest to item');
		}

		this.element = event.target;
		this.elementParent = this.element.parentNode;
	}
	drop(event) {
		event.preventDefault();
		const target = event.target.tagName;

		if(!this.targetString.includes(target)) {
			return;
		}
		
		const slotFrom = this.element.tagName === 'IMG'? this.elementParent.id : this.element.id;
		const slotTo = target === 'IMG'? event.target.parentNode.id : event.target.id;

		this.websocket.sendJSON({
			event: 'containerDragDrop',
			from: slotFrom,
			to: slotTo,
		});
		this.queue.push({
			target: event.target,
			tag: target,
		});
	}
	finishDrop(config) {
		switch(config.tag) {
			case 'IMG': {
				const element = config.target;
				element.parentNode.replaceChild(this.element, config.target);
				this.elementParent.appendChild(element);
				break;
			}
			case 'TD': {
				config.target.appendChild(this.element);
				break;
			}
		}
	}
	callFromQueue() {
		const config = this.queue.shift();
		this.finishDrop(config);
	}
	removeFromQueue() {
		this.queue.shift();
	}
}
