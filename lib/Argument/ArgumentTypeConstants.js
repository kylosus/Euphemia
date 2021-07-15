const ArgumentType = require('./ArgumentType');
const Constants    = require('../Constants');
const moment       = require('moment');

const idRegex     = /\d{5,}/;
const userIdRegex = /<?@?!?\d{5,}>?/;
const flatten     = ids => ids[0].trim();
const idExtract   = ids => ids.map(i => /\d+/g.exec(i)[0].trim());

const idExtractFlatten = ids => idExtract(ids)[0].trim();

module.exports = {
	MEMBER: new ArgumentType(/<?@?!?\d{5,}>?/, idExtractFlatten, async (message, id) => {
		const member = message.guild.members.fetch(id);

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
		const members = await message.guild.members.fetch({ user: ids });

		if (!members?.size) {
			if (ids.length === 1) {
				throw `Member ${ids[0]} not found`;
			}

			throw 'Members not found';
		}

		return members;
	}),

	USER: new ArgumentType(/<?@?!?\d{5,}>?/, idExtractFlatten, async (message, id) => {
		return message.client.users.fetch(id);
	}),

	USERS: new ArgumentType(/<?@?!?\d{5,}>?/g, idExtract, async (message, ids) => {
		// this is exceedingly stupid, just do a cache lookup yourself
		// if you need to parse users for some reason (instead of GuildMembers,
		// it's most likely just for their ids anyway. Goddamn man
		// Also just generalize whatever CHANNELS is doing
		const users = (await Promise.all(ids.map(id => message.client.users.fetch(id))))
			.filter(c => c);

		if (!users.length) {
			if (ids.length === 1) {
				throw `User ${ids[0]} not found`;
			}

			throw 'Users not found';
		}

		return users;
	}),

	CHANNEL: new ArgumentType(/<#\d+>/, idExtractFlatten, (message, id) => {
		const channel = message.guild.channels.cache.get(id);

		if (!channel || !channel.isText()) {
			throw 'Channel not found';
		}

		return channel;
	}),

	CHANNELS: new ArgumentType(/<#\d+>/g, idExtract, async (message, ids) => {
		const channels = message.guild.channels.filter(c => c in ids).filter(c => c.isText());

		// this is a bit problematic
		if (!channels.length) {
			if (ids.length === 1) {
				throw `Channel ${ids[0]} not found`;
			}

			throw 'Channels not found';
		}

		return channels;
	}),

	ID: new ArgumentType(/<?@?!?\d{5,}>?/, idExtractFlatten),	// Not my proudest regex

	IDS: new ArgumentType(/<?@?!?\d{5,}>?/g, idExtract),

	NUMBER: new ArgumentType(/\d+/, flatten, (_, n) => Number(n)),

	TEXT: new ArgumentType(/.*/, flatten),

	REASON: new ArgumentType(/.*/, flatten, (_, s) => {
		if (s.length > Constants.REASON_MAX) {
			throw `Reason is too long. Max is ${Constants.REASON_MAX}`;
		}

		return s;
	}),

	WORD: new ArgumentType(/\w+/, flatten),

	JSON: new ArgumentType(/{.*}/, flatten),

	MESSAGE_URL: new ArgumentType(
		/https:\/\/(\w+\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
		flatten
	),

	DURATION: new ArgumentType(
		/\d+[ymwd]?/i,
		// /(\d+s)?(\d+m)?(\d+w)?(\d+y)?/i,
		flatten,
		(_, d) => {
			const try1 = moment.duration('P' + d.toUpperCase());

			if (try1.toISOString() !== 'P0D') {
				return try1;
			}

			return moment.duration('PT' + (s => {
				if (s.substr(-1) === 'M') {
					return s;
				}

				return s + 'M';
			})(d.toUpperCase()));
		}
	)
};

module.exports.idRegex          = idRegex;
module.exports.userIdRegex      = userIdRegex;
module.exports.idExtractFlatten = idExtractFlatten;
module.exports.flatten          = flatten;
