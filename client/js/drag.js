class DragDrop {
	constructor() {
		this.element = null;
		this.elementParent = null;
		// const inventory = document.getElementById('inventory');
		// inventory.addEventListener('dragstart', this.drag.bind(this));
		// inventory.addEventListener('dragover', this.allow.bind(this));
		// inventory.addEventListener('drop', this.drop.bind(this));
		// const equipment = document.getElementById('equipment');
		// equipment.addEventListener('dragstart', this.drag.bind(this));
		// equipment.addEventListener('dragover', this.allow.bind(this));
		// equipment.addEventListener('drop', this.drop.bind(this));
	}
	clear() {
		this.element = null;
		this.elementParent = null;
	}
	allow(event) {
		event.preventDefault();
	}
	drag(event) {
		// if(event.target.parentNode.className.indexOf('item') === -1) {
		// 	return;
		// };
		this.element = event.target;
		this.elementParent = this.element.parentNode;
	}
	drop(event) {
		event.preventDefault();
		const target = event.target;

		if(target.tagName === 'IMG') {
			return this.swap(event);
		} else if(target.tagName === 'TD') { //&& target.className.indexOf('item') !== -1) {
			target.appendChild(this.element);
		}
	}
	swap(event) {
		const element = event.target;
		element.parentNode.replaceChild(this.element, event.target);
		this.elementParent.appendChild(element);
	}
}
