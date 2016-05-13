'use strict';

// --------------
// Dependencies
// --------------
// ...

class Inventory {
	constructor(config = {}) {
		this.owner = config.owner; // to check if you can even carry that much weight
		this.capacity = config.capacity || 10;
		this.pointer = config.pointer || {};
		this.container = config.container || [];
		this.availableSlots = []; // ta tablica mialaby przechowywac zawsze najmniejszy index, zeby 
		// nowe itemy byly wstsawiane na poczatek a nie od konca.
	}
	move() { // main action performed each time player moves item from 1 slot to another

	}
	show() {
		console.log(this.container);
	}
	put(item) {
		if(this.container.length === this.capacity) {
			return false; // inventory is full.
		}
		const index = this.container.push(item) - 1;
		this.pointer[item.id] = index;
		return true;
	}
	take(id) {
		const index = this.pointer[id];
		const item = this.container[index];
		this.container[index] = null;
		return item;
	}
	get(id) {
		return this.container[this.pointer[id]] || null;
	}
	has(id) {
		return !!~this.pointer[id];
	}
	swap(id1, id2) {
		const index_1 = this.pointer[id1];
		const index_2 = this.pointer[id2];
		const item_1 = this.container[index_1];

		//swap the actual items
		this.container[index_1] = this.container[index_2];
		this.container[index_2] = item_1;

		//swap pointers
		this.pointer[index_1] = index_2;
		this.pointer[index_2] = index_1;
	}
	stack(id1, id2) {
		const itemStacked = this.inventory.get(id1);
		const itemDestroyed = this.inventory.get(id2);
		const canProceed = this.compare(itemStacked, itemDestroyed);
		if(!canProceed) {
			this.container[id2] = itemDestroyed;
			this.pointer[itemDestroyed.id] = id2;
			return null;
		}

		itemStacked.stack(itemDestroyed);

		return itemStacked;
	}
	compare(item1, item2) {
		if(!itemStacked || !itemDestroyed) {
			return false; // one of them is null/undefined
		}
		if(itemStacked.group !== itemDestroyed.group) {
			return false; // different group, therefore what's the point even trying?
		}
		if(itemStacked.type !== itemDestroyed.type) {
			return false; // different type, therefore what's the point even trying?
		}
		if(itemStacked.quality !== itemDestroyed.quality) {
			return false; // different quality, therefore what's the point even trying?
		}
		if(itemStacked.grade !== itemDestroyed.grade) {
			return false; // different quality, therefore what's the point even trying?
		}
		if(!itemStacked.isStackable() || !itemDestroyed.isSstackable()) {
			return false; // one of them is not stackable
		}

		return true;
	}
};
module.exports = Inventory;