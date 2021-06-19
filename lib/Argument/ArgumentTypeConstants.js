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

		if (!members || !members.size) {
			if (ids.length === 1) {
				throw `Member ${ids[0]} not found`;
			}

			throw 'Members not found';
		}

		return members;
	}),

	CHANNEL: new ArgumentType(/<#\d+>/, idExtractFlatten),
	CHANNELS: new ArgumentType(/<#\d+>/g, idExtract),
	NUMBER: new ArgumentType(/\d+/, flatten),
	TEXT: new ArgumentType(/.*/, flatten)
};