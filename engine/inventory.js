'use strict';

// --------------
// Dependencies
// --------------
// ...

class Inventory {
	constructor(config = {}) {
		this.owner = config.owner || null; // to check if you can even carry that much weight
		// this.capacity = config.capacity || 100;
		// this.count = config.count || 0;
		this.slots = config.slots || {}; // which slots are occupied. // 1 - 100, not 0 - 99
		// this.container = config.container || {}; // maps item.id -> item
		console.log('To sa itemy:', this.slots);
	}

	put(slot, item) { // puts [item] in the given [slot]
		const slotFree = !this.slots[slot];
		// const capacityReached = this.count === this.capacity;
		if(!slotFree) {
			return console.log(`Slot#${slot} is occupied.`);
		}

		this.slots[slot] = item;
		// this.container[item.id] = item;
	}
};
module.exports = Inventory;