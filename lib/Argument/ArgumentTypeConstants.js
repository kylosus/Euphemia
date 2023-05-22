import ArgumentType                                              from './ArgumentType.js';
import { REASON_MAX }                                            from '../Constants.js';
import dayjs                                                     from 'dayjs';
import { inlineCode, ChannelType, ApplicationCommandOptionType } from 'discord.js';
import { EmbedError }                                            from '../Error/index.js';

export const idRegex      = /\b(\d{5,50})\b/;
export const idRegexG     = /\b(\d{5,50})\b/g;
export const userIdRegex  = /(?:<@|\s|^)(\d{5,50})>?/;
export const userIdRegexG = /(?:<@|\s|^)(\d{5,50})>?/g;
export const channelIdRegex  = /(?:<#|\s|^)(\d{5,50})>?/;
export const channelIdRegexG = /(?:<#|\s|^)(\d{5,50})>?/g;
export const roleIdRegex  = /(?:<@&|\s|^)(\d{5,50})>?/;
export const roleIdRegexG = /(?:<@&|\s|^)(\d{5,50})>?/g;
export const flatten      = ids => ids[0].trim();
export const idExtract    = ids => ids.map(i => /\d+/g.exec(i)[0].trim());

export const idExtractFlatten = ids => idExtract(ids)[0].trim();

export const fetchCache = async (ids, manager, prop) => {
	const results = [];

	for (const id of ids) {
		console.log(id);

		const cached = manager.cache.get(id);

		if (!cached) {
			return manager.fetch({ [prop]: ids, force: true });
		}

		results.push(cached);
	}

	return results;
};

// Similar to above, but fetches individually
export const fetchCacheSplit = async (ids, manager) => {
	const promises = await Promise.allSettled(ids.map(id => manager.fetch(id)));

	return promises
		.filter(p => p.status === 'fulfilled')
		.map(p => p.value);
};


export const TYPE = {
	MEMBER: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		regex:       userIdRegex,
		member:      true,
		normalizer:  flatten,
		finder:      async (message, id) => {
			return await message.guild.members.fetch(id).catch(() => {
				throw new EmbedError(`Member ${inlineCode(id)} not found`);
			});
		}
	}),

	MEMBERS: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		multiple:    true,
		member:      true,
		regex:       userIdRegexG,
		// normalizer:  idExtract,
		finder:      async (message, ids) => {
			const members = await fetchCache(ids, message.guild.members, 'user');

			if (!members.length) {
				throw new EmbedError('Members not found');
			}

			return members;
		},
	}),

	USER: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		regex:       userIdRegex,
		normalizer:  flatten,
		finder:      async (message, id) => {
			return message.client.users.fetch(id).catch(() => {
				throw new EmbedError(`User ${inlineCode(id)} not found`);
			});
		}
	}),

	USERS: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		multiple:    true,
		regex:       userIdRegexG,
		// normalizer:  idExtract,
		finder:      async (message, ids) => {
			const users = await fetchCacheSplit(ids, message.client.users);

			if (!users.length) {
				throw new EmbedError('Users not found');
			}

			return users;
		}
	}),

	CHANNEL: new ArgumentType({
		commandType: ApplicationCommandOptionType.Channel,
		regex:       channelIdRegex,
		normalizer:  flatten,
		finder:      async (message, id) => {
			const channel = await message.guild.channels.fetch(id);

			if (!channel || channel.type !== ChannelType.GuildText) {
				throw new EmbedError('Channel not found');
			}

			return channel;
		}
	}),

	CHANNELS: new ArgumentType({
		commandType: ApplicationCommandOptionType.Channel,
		regex:       channelIdRegexG,
		// normalizer:  flatten,
		finder:      async (message, ids) => {
			const channels = (await fetchCacheSplit(ids, message.guild.channels))
				.filter(c => c.type === ChannelType.GuildText);

			if (!channels.length) {
				throw new EmbedError('Channels not found');
			}

			return channels;
		}
	}),

	ROLES: new ArgumentType({
		commandType: ApplicationCommandOptionType.Role,
		regex:       roleIdRegexG,
		// normalizer:  flatten,
		finder:      async (message, ids) => {
			const roles = ids.map(id => message.guild.roles.cache.get(id)).filter(_ => _);

			// this is a bit problematic
			if (!roles.length) {
				throw new EmbedError('Roles not found');
			}

			return roles;
		}
	}),

	// Single word rolename
	ROLE_LOOSE_SINGLE: new ArgumentType({
		commandType: ApplicationCommandOptionType.Role,
		regex:       /(\w+)/,
		normalizer:  flatten,
		finder:      roleFinder
	}),

	ROLE_LOOSE: new ArgumentType({
		commandType: ApplicationCommandOptionType.Role,
		regex:       /(.*)/,
		normalizer:  flatten,
		finder:      roleFinder
	}),

	ID: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       idRegex,
		normalizer:  flatten
	}),

	// ?
	// BARE_ID: new ArgumentType({
	// 	commandType: ApplicationCommandOptionType.String,
	// 	regex:       /(^|\s)\d{5,50}($|\s)/,
	// 	normalizer:  idExtractFlatten
	// }),

	IDS: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       idRegexG,
		// normalizer:  idExtract
	}),

	NUMBER: new ArgumentType({
		commandType: ApplicationCommandOptionType.Integer,
		regex:       /(\d+)/,
		normalizer:  flatten,
		finder:      (_, n) => Number(n)
	}),

	TEXT: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /(.*)/,
		normalizer:  flatten
	}),

	REASON: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /(.*)/,
		normalizer:  flatten,
		finder:      (_, s) => {
			if (s.length > REASON_MAX) {
				// Maybe this should just trim
				throw new EmbedError(`Reason is too long. Max is ${REASON_MAX}`);
			}

			return s;
		}
	}),

	WORD: new ArgumentType({
		regex:      /(\w{2,50})/,
		normalizer: flatten,
	}),

	JSON: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /({.*})/,
		normalizer:  flatten
	}),

	MESSAGE_URL: new ArgumentType({
		regex:      /(https:\/\/(?:\w+\.)?discord\.com\/channels\/\d+\/\d+\/\d+)/,
		normalizer: flatten
	}),

	DURATION: new ArgumentType({
		commandType: ApplicationCommandOptionType.Number,
		regex:       /(\d+[ymwhd]?)/i,
		// /(\d+s)?(\d+m)?(\d+w)?(\d+y)?/i,
		normalizer: flatten,
		finder:     (_, d) => {
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
	})
};

// Helper stuff
function roleFinder({ guild }, roleRes) {
	return guild.roles.cache.get(roleRes) ||
		guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
		guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
		(() => {
			throw new EmbedError('Role not found');
		})();
}