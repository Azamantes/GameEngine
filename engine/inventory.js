'use strict';

// --------------
// Dependencies
// --------------
const Container = require('./items/container.js');

class Inventory extends Container {
	constructor(config) {
		super(config);
		this.name = 'inventory';
		// this.capacity = config.capacity || 100;
		// this.count = config.count || 0;
	}
	swap(slotFrom, slotTo) {
		slotFrom = ~~slotFrom;
		slotTo = ~~slotTo;

		const itemTo = this.slots[slotTo];
		this.slots[slotTo] = this.slots[slotFrom];
		this.slots[slotFrom] = itemTo;

		return true;
	}
}
module.exports = Inventory;