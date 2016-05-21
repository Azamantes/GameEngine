class DragDrop {
	constructor(ws) {
		this.websocket = ws;
		this.element = null;
		this.elementParent = null;
		this.eqSlotList = ['head', 'ring1', 'ring2', 'neck', 'chest',
			'hand-left'.replace(/\-/, '\\\\-'),
			'hand-right'.replace(/\-/, '\\\\-'),
			'gloves', 'pants', 'waist', 'boots'
		];
		this.regexp = new RegExp('(inv\\-item#[0-9]+)|(eq\\-(' + this.eqSlotList.join('|') + '))', '');
		this.targetString = 'TDIMG';
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
			console.log('Nie jest to item');
			return;
		}
		// if(event.target.parentNode.className.indexOf('item') === -1) {
		// 	return;
		// };
		this.element = event.target;
		this.elementParent = this.element.parentNode;
	}
	drop(event) {
		event.preventDefault();
		const target = event.target.tagName;

		// tutaj wszystko sie bedzie dziac

		if(!this.targetString.includes(target)) {
			console.log('be');
			return;
		}
		
		const slotFrom = this.element.tagName === 'IMG'? this.elementParent.id : this.element.id;
		const slotTo = event.target.tagName === 'IMG'? event.target.parentNode.id : event.target.id;

		console.log(slotFrom, slotTo);
		this.websocket.sendJSON({
			event: 'containerDragDrop',
			from: slotFrom,
			to: slotTo,
		});

		if(event.target.tagName === 'IMG') {
			const element = event.target;
			element.parentNode.replaceChild(this.element, event.target);
			this.elementParent.appendChild(element);
			return;
		} else if(event.target.tagName === 'TD') {
			event.target.appendChild(this.element);
		}
	}
}
