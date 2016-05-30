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
}
module.exports = Equipment;