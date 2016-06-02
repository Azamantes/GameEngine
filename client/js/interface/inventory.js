'use strict';

class Inventory {
	constructor(channel, root) {
		this.channel = channel;
		this.root = root;
		this.slots = {};

		this.channel.listen('ws: inventory', this.init.bind(this));
	}
	init(slots) {
		this.slots = slots;
		this.render();
		this.channel.shout('drag: bind', this.root);
	}
	render() {
		m.render(this.root, this.view());
	}
	view() {
		const CAPACITY = 100;
		const rows = [];
		const itemClass = { class: 'inv-item' };
		
		let line = ~~(CAPACITY / 10);
		let i = 0;
		let cell, row, box;

		while(--line + 1) {
			row = [];
			cell = -1;
			while(++cell < 10) {
				++i;
				box = m('td', { id: 'inv#' + i });
				if(this.slots[i]) {
					box.children.push( m('img', { src: this.slots[i].src }) );
				}
				row.push(box);
			}
			rows.push(m('tr', row));
		}
		return m('tbody', { id: 'equipment' }, rows);
	}
	update(config) {
		switch(config.action) {
			case 1: { // put
				const element = document.createElement('img');
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				doc.get('inv-item#' + config.slot).appendChild(element);
				break;
			}
			case 2: { // change
				const element = doc.get('inv-item#' + config.slot).firstChild;
				element.setAttribute('id', config.id);
				element.setAttribute('src', config.src);
				break;
			}
			case 3: { // remove
				const element = doc.get('inv-item#' + config.slot);
				element.removeChild(element.firstChild);
				break;
			}
		}
	}
}