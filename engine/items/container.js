'use strict';

class Container {
	constructor(config) {
		this.slots = config.slots;
	}
	has(slot) {
		return !!this.slots[slot];
	}
	isFree(slot) {
		return !this.slots[slot];
	}
	get(slot) {
		return this.slots[slot] || NaN;
	}
	take(slot) {
		if(this.has(slot)) {
			const item = this.slots[slot];
			this.slots[slot] = null;
			return item;
		} else return null;
	}
	put(item, slot) {
		if(!this.isFree(slot)) {
			return false;
		}
		this.slots[slot] = item;
		console.log(`${this.name} put item#${item.id} into [${slot}] slot.`);
		return true;
	}
	calculateWeight() {
		const array = Object.keys(this.slots);
		const i = array.length;
		let sum = 0;
		while(--i + 1) {
			if(array[i].weight === undefined) {
				console.warn(`Item#${array[i].name} doesn't have weight.`);
			}
			sum += array[i].weight;
		}
		return sum;
	}
}

module.exports = Container;