'use strict';

// --------------
// Dependencies
// --------------
const Container = require('./items/container.js');

class Equipment extends Container {
	constructor(config) {
		super(config);
		this.name = 'equipment';
	}
	canEquip(item, slot) {
		if(!slot.includes(item.slot)) {
			return false;
		}

		if(!!this.slots[slot]) {
			return false;
		}

		return true;
	}
}
module.exports = Equipment;