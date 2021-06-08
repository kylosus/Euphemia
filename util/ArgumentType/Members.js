const { ArgumentType } = require('discord.js-commando');

class MembersArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'members');
	}

	validate(val) {
		return val.toLowerCase() === 'dank';
	}

	parse(val) {
		return val;
	}
}

module.exports = MembersArgumentType;