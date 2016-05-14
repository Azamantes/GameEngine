'use strict';

// --------------
// Dependencies
// --------------
// ...

class Inventory {
	constructor(config = {}) {
		this.owner = config.owner; // to check if you can even carry that much weight
		this.capacity = config.capacity || 100;
		this.count = config.count;
		this.slots = {}; // which slots are occupied. // 1 - 100, not 0 - 99
		this.container = config.container; // maps item.id -> item
		console.log('To sa itemy:', this.container);
	}
	// findFreeSlot() {
	// 	const max = this.capacity;
	// 	let i = 0;
	// 	while(++i < max) {
	// 		if(!this.slots[i]) {
	// 			break;
	// 		}
	// 	}
	// 	return i;
	// }
	// move(a, b) { // moves item from slot a to slot b

	// }
	put(slot, item) { // puts [item] in the given [slot]
		const slotFree = !!this.slots[slot];
		const capacityReached = this.count === this.capacity;
		if(!slotFree || capacityReached) {
			return console.log('Cannot put item#' + item.id + ' into slot#' + slot + '.');
		}
		this.slots[slot] = item.nr;
		this.container[item.id] = item;
	}
	// take(slot) { // takes item from given [slot] and removes it from container
	// 	const item = this.
	// }
	// get(itemID) { // returns reference to item with the given [itemID]

	// }
	// has(itemID) { //

	// }
	// put(item) {
	// 	if(this.length === this.capacity) {
	// 		return false; // inventory is full.
	// 	}
	// 	// const index = this.container.push(item) - 1;
	// 	this.pointer[item.id] = item;
	// 	return true;
	// }
	// take(id) {
	// 	// const index = this.pointer[id];
	// 	const item = this.container[id];
	// 	this.container[id] = null;
	// 	return item;
	// }
	// get(id) {
	// 	return this.container[id] || null;
	// }
	// has(id) {
	// 	return !!this.pointer[id];
	// }
	// swap(id1, id2) {
	// 	// const index_1 = this.pointer[id1];
	// 	// const index_2 = this.pointer[id2];
	// 	// const item_1 = this.container[index_1];

	// 	const item_1 = this.container[id1];
	// 	this.container[id1] = this.container[id2];
	// 	this.container[id2] = item_1;

	// 	//swap the actual items
	// 	// this.container[index_1] = this.container[index_2];
	// 	// this.container[index_2] = item_1;

	// 	//swap pointers
	// 	// this.pointer[index_1] = index_2;
	// 	// this.pointer[index_2] = index_1;
	// }
	// stack(id1, id2) {
	// 	// const itemStacked = this.inventory.get(id1);
	// 	// const itemDestroyed = this.inventory.get(id2);
	// 	// const canProceed = this.compare(itemStacked, itemDestroyed);
	// 	// if(!canProceed) {
	// 	// 	this.container[id2] = itemDestroyed;
	// 	// 	this.pointer[itemDestroyed.id] = id2;
	// 	// 	return null;
	// 	// }

	// 	// itemStacked.stack(itemDestroyed);

	// 	// return itemStacked;
	// }
	// compare(item1, item2) {
	// 	if(!itemStacked || !itemDestroyed) {
	// 		return false; // one of them is null/undefined
	// 	}
	// 	if(itemStacked.group !== itemDestroyed.group) {
	// 		return false; // different group, therefore what's the point even trying?
	// 	}
	// 	if(itemStacked.type !== itemDestroyed.type) {
	// 		return false; // different type, therefore what's the point even trying?
	// 	}
	// 	if(itemStacked.quality !== itemDestroyed.quality) {
	// 		return false; // different quality, therefore what's the point even trying?
	// 	}
	// 	if(itemStacked.grade !== itemDestroyed.grade) {
	// 		return false; // different quality, therefore what's the point even trying?
	// 	}
	// 	if(!itemStacked.isStackable() || !itemDestroyed.isSstackable()) {
	// 		return false; // one of them is not stackable
	// 	}

	// 	return true;
	// }
};
module.exports = Inventory;