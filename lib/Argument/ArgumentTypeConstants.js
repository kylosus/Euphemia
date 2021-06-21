const ArgumentType = require('./ArgumentType');

const flatten = ids => ids[0].trim();

const idExtract = ids => {
	return ids.map(i => /\d+/g.exec(i)[0].trim());
};

const idExtractFlatten = ids => {
	return idExtract(ids)[0].trim();
};

module.exports = {
	MEMBER: new ArgumentType(/<?@?!?\d{5,}>?/, idExtractFlatten, async (message, id) => {
		const member = message.guild.members.cache.get(id);

		if (member) {
			return member;
		}

		// Might not result in an error idk
		const memberFetched = await message.guild.fetch(id);

		if (!memberFetched || !memberFetched.size) {
			throw `Member ${id} not found`;
		}

		return memberFetched;
	}),

	MEMBERS: new ArgumentType(/<?@?!?\d{5,}>?/g, idExtract, async (message, ids) => {
		const members = await message.guild.members.fetch({user: ids});

		// this is a bit problematic
		if (!members || !members.size) {
			if (ids.length === 1) {
				throw `Member ${ids[0]} not found`;
			}

			throw 'Members not found';
		}

		return members;
	}),

	USER: new ArgumentType(/<?@?!?\d{5,}>?/, idExtractFlatten, async (message, id) => {
		return await message.client.users.fetch(id);
	}),

	CHANNEL: new ArgumentType(/<#\d+>/, idExtractFlatten, async (message, id) => {
		return message.guild.channels.resolve(id);
	}),

	CHANNELS: new ArgumentType(/<#\d+>/g, idExtract, async (message, ids) => {
		const channels = (await Promise.all(ids.map(async id => await message.guild.channels.resolve(id))))
			.filter(c => c);

		// this is a bit problematic
		if (!channels.length) {
			if (ids.length === 1) {
				throw `Channel ${ids[0]} not found`;
			}

			throw 'Channels not found';
		}

		return channels;
	}),

	NUMBER: new ArgumentType(/\d+/, flatten, (_, n) => Number(n)),

	TEXT: new ArgumentType(/.*/, flatten)
};