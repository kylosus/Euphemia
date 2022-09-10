import ArgumentType   from './ArgumentType.js';
import { REASON_MAX } from '../Constants.js';
import dayjs          from 'dayjs';
import { Formatters } from 'discord.js';

export const idRegex     = /\d{5,50}/;
export const userIdRegex = /<?@?!?\d{5,50}>?/;
export const flatten     = ids => ids[0].trim();
export const idExtract   = ids => ids.map(i => /\d+/g.exec(i)[0].trim());

export const idExtractFlatten = ids => idExtract(ids)[0].trim();

export const TYPE = {
	MEMBER: new ArgumentType(userIdRegex, idExtractFlatten, async (message, id) => {
		return await message.guild.members.fetch(id).catch(() => {
			throw `Member ${Formatters.inlineCode(id)} not found`;
		});
	}),

	MEMBERS: new ArgumentType(/<?@?!?\d{5,50}>?/g, idExtract, async (message, ids) => {
		const members = await message.guild.members.fetch({ user: ids });

		if (!members.size) {
			throw 'Members not found';
		}

		return members;
	}),

	USER: new ArgumentType(userIdRegex, idExtractFlatten, async (message, id) => {
		return message.client.users.fetch(id).catch(() => {
			throw `User ${Formatters.inlineCode(id)} not found`;
		});
	}),

	USERS: new ArgumentType(/<?@?!?\d{5,50}>?/g, idExtract, async (message, ids) => {
		// this is exceedingly stupid, just do a cache lookup yourself
		// if you need to parse users for some reason (instead of GuildMembers,
		// it's most likely just for their ids anyway. Goddamn man
		// Also just generalize whatever CHANNELS is doing
		const users = (await Promise.allSettled(ids.map(id => message.client.users.fetch(id))))
			.filter(p => p.status === 'fulfilled')
			.map(p => p.value);

		if (!users.length) {
			throw 'Users not found';
		}

		return users;
	}),

	CHANNEL: new ArgumentType(/<?#?\d+>?/, idExtractFlatten, (message, id) => {
		const channel = message.guild.channels.cache.get(id);

		if (!channel || !channel.isText()) {
			throw 'Channel not found';
		}

		return channel;
	}),

	CHANNELS: new ArgumentType(/<?#?\d+>?/g, idExtract, async (message, ids) => {
		const channels = ids
			.map(id => message.guild.channels.cache.get(id))
			.filter(_ => _)
			.filter(c => c.isText());

		if (!channels.length) {
			throw 'Channels not found';
		}

		return channels;
	}),

	ROLES: new ArgumentType(/<?@?&?\d{5,}>?/g, idExtract, async (message, ids) => {
		const roles = ids.map(id => message.guild.roles.cache.get(id)).filter(_ => _);

		// this is a bit problematic
		if (!roles.length) {
			throw 'Roles not found';
		}

		return roles;
	}),

	ROLE_LOOSE: new ArgumentType(
		/.*/,
		flatten,
		({ guild }, roleRes) => {
			return guild.roles.cache.get(roleRes) ||
				guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
				guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
				(() => {
					throw 'Role not found';
				})();
		}
	),

	ROLE_OR_ID_LOOSE: new ArgumentType(
		/\w+/,
		flatten,
		({ guild }, roleRes) => {
			return guild.roles.cache.get(roleRes) ||
				guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
				guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
				(() => {
					throw 'Role not found';
				})();
		}
	),

	ID: new ArgumentType(userIdRegex, idExtractFlatten),	// Not my proudest regex

	IDS: new ArgumentType(/<?@?!?\d{5,50}>?/g, idExtract),

	NUMBER: new ArgumentType(/\d+/, flatten, (_, n) => Number(n)),

	TEXT: new ArgumentType(/.*/, flatten),

	REASON: new ArgumentType(/.*/, flatten, (_, s) => {
		if (s.length > REASON_MAX) {
			throw `Reason is too long. Max is ${REASON_MAX}`;
		}

		return s;
	}),

	WORD: new ArgumentType(/\w{2,50}/, flatten),

	JSON: new ArgumentType(/{.*}/, flatten),

	MESSAGE_URL: new ArgumentType(
		/https:\/\/(\w+\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
		flatten
	),

	DURATION: new ArgumentType(
		/\d+[ymwhd]?/i,
		// /(\d+s)?(\d+m)?(\d+w)?(\d+y)?/i,
		flatten,
		(_, d) => {
			const try1 = dayjs.duration('P' + d.toUpperCase());

			if (try1.toISOString() !== 'P0D') {
				return try1;
			}

			return dayjs.duration('PT' + (s => {
				if (s.charAt(s.length - 1) === 'M') {
					return s;
				}

				return s + 'M';
			})(d.toUpperCase()));
		}
	)
};
