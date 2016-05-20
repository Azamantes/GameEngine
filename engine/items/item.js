'use strict';

// --------------
// Dependencies
// --------------
// ...

class Item {
	constructor(config = {}) {
		this.id = config.id;
		this.img = config.img;
		this.name = config.name;
		this.src = config.src;
		this.model = config.model;
		this.type = config.type;
		// this.quality = config.quality;
		// this.grade = config.grade;
		// this.weight = config.weight;
		this.slot = config.slot;
		// this.effects = config.effects;
		// this.skills = config.skills;
		// this.flags = config.flags || Math.pow(2, 31) - 1;
			// 1. consumable // can you eat/use it? scrolls, food
			// 2. destructible // can you destroy/disassemble it?
			// 3. durable // 1 -> has durability, 0 -> no durability
			// 4. equippable // can you put it in an EQ slot? helm, shield, weapon etc.
			// 5. reusable // if I consume it, will it disappear? food yes, teleportation runes nope.
			// 6. stackable // can you stack it? like potions or some cloth/skin/gems
			// 7. upgradable // can you upgrade it? like in Mu Online from +0 to +11/+13/+15
		
			// there are 32 bits, try to utilize as much of them as you can.

		this.requiredStats = config.requiredStats;
		this.usableBy = config.usableBy;
		this.material = config.material;
	}
	isConsumable() {
		return !!(this.flags & 1);
	}
	isDestructible() {
		return !!(this.flags & (1 << 1));
	}
	isDurable() {
		return !!(this.flags & (1 << 2));
	}
	isEquippable() {
		return !!(this.flags & (1 << 3));
	}
	isReusable() {
		return !!(this.flags & (1 << 4));
	}
	isStackable() {
		return !!(this.flags & (1 << 5));
	}
	isUpgradable() {
		return !!(this.flags & (1 << 6));
	}
}
module.exports = Item;