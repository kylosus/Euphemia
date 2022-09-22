import ArgumentType                                              from './ArgumentType.js';
import { REASON_MAX }                                            from '../Constants.js';
import dayjs                                                     from 'dayjs';
import { inlineCode, ChannelType, ApplicationCommandOptionType } from 'discord.js';

export const idRegex     = /\d{5,50}/;
export const userIdRegex = /<?@?!?\d{5,50}>?/;
export const flatten     = ids => ids[0].trim();
export const idExtract   = ids => ids.map(i => /\d+/g.exec(i)[0].trim());

export const idExtractFlatten = ids => idExtract(ids)[0].trim();

export const TYPE = {
	MEMBER: new ArgumentType({
		commandType: ApplicationCommandOptionType.Mentionable,
		regex:       userIdRegex,
		normalizer:  idExtractFlatten,
		finder:      async (message, id) => {
			return await message.guild.members.fetch({ user: id }).catch(() => {
				throw `Member ${inlineCode(id)} not found`;
			});
		}
	}),

	MEMBERS: new ArgumentType({
		commandType: ApplicationCommandOptionType.Mentionable,
		multiple:    true,
		regex:       /<?@?!?\d{5,50}>?/g,
		normalizer:  idExtract,
		finder:      async (message, ids) => {
			const members = await message.guild.members.fetch({ user: ids });

			if (!members.size) {
				throw 'Members not found';
			}

			return members;
		}
	}),

	USER: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		regex:       userIdRegex,
		normalizer:  idExtractFlatten,
		finder:      async (message, id) => {
			return message.client.users.fetch(id).catch(() => {
				throw `User ${inlineCode(id)} not found`;
			});
		}
	}),

	USERS: new ArgumentType({
		commandType: ApplicationCommandOptionType.User,
		multiple:    true,
		regex:       /<?@?!?\d{5,50}>?/g,
		normalizer:  idExtract,
		finder:      async (message, ids) => {
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
		}
	}),

	CHANNEL: new ArgumentType({
		commandType: ApplicationCommandOptionType.Channel,
		regex:       /<?#?\d+>?/,
		normalizer:  idExtractFlatten,
		filter:      (message, id) => {
			const channel = message.guild.channels.cache.get(id);

			if (!channel || channel.type !== ChannelType.GuildText) {
				throw 'Channel not found';
			}

			return channel;
		}
	}),

	CHANNELS: new ArgumentType({
		commandType: ApplicationCommandOptionType.Channel,
		regex:       /<?#?\d+>?/g,
		normalizer:  idExtract,
		finder:      async (message, ids) => {
			const channels = ids
				.map(id => message.guild.channels.cache.get(id))
				.filter(_ => _)
				.filter(c => c.type === ChannelType.GuildText);

			if (!channels.length) {
				throw 'Channels not found';
			}

			return channels;
		}
	}),

	ROLES: new ArgumentType({
		commandType: ApplicationCommandOptionType.Role,
		regex:       /<?@?&?\d{5,}>?/g,
		normalizer:  idExtract,
		finder:      async (message, ids) => {
			const roles = ids.map(id => message.guild.roles.cache.get(id)).filter(_ => _);

			// this is a bit problematic
			if (!roles.length) {
				throw 'Roles not found';
			}

			return roles;
		}
	}),

	ROLE_LOOSE: new ArgumentType({
		regex:      /.*/,
		normalizer: flatten,
		finder:     ({ guild }, roleRes) => {
			return guild.roles.cache.get(roleRes) ||
				guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
				guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
				(() => {
					throw 'Role not found';
				})();
		}
	}),

	ROLE_OR_ID_LOOSE: new ArgumentType({
		regex:      /\w+/,
		normalizer: flatten,
		finder:     ({ guild }, roleRes) => {
			return guild.roles.cache.get(roleRes) ||
				guild.roles.cache.find(r => r.name.toLowerCase() === roleRes.toLowerCase()) ||
				guild.roles.cache.find(r => r.name.toLowerCase().startsWith(roleRes.toLowerCase())) ||
				(() => {
					throw 'Role not found';
				})();
		}
	}),

	ID: new ArgumentType({
		commandType: ApplicationCommandOptionType.Integer,
		regex:       userIdRegex,
		normalizer:  idExtractFlatten
	}),	// Not my proudest regex

	IDS: new ArgumentType({
		commandType: ApplicationCommandOptionType.Integer,
		regex:       /<?@?!?\d{5,50}>?/g,
		normalizer:  idExtract
	}),

	NUMBER: new ArgumentType({
		commandType: ApplicationCommandOptionType.Integer,
		regex:       /\d+/,
		normalizer:  flatten,
		finder:      (_, n) => Number(n)
	}),

	TEXT: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /.*/,
		normalizer:  flatten
	}),

	REASON: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /.*/,
		normalizer:  flatten,
		finder:      (_, s) => {
			if (s.length > REASON_MAX) {
				throw `Reason is too long. Max is ${REASON_MAX}`;
			}

			return s;
		}
	}),

	WORD: new ArgumentType({
		regex:      /\w{2,50}/,
		normalizer: flatten,
	}),

	JSON: new ArgumentType({
		commandType: ApplicationCommandOptionType.String,
		regex:       /{.*}/,
		normalizer:  flatten
	}),

	MESSAGE_URL: new ArgumentType({
		regex:      /https:\/\/(\w+\.)?discord\.com\/channels\/\d+\/\d+\/\d+/,
		normalizer: flatten
	}),

	DURATION: new ArgumentType({
		regex: /\d+[ymwhd]?/i,
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
