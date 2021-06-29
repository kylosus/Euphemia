const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

const { mutedRole, muteHandler } = require('../../modules/mute');

const moment = require('moment');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['mute'],
			description: {
				content: 'Mutes mentioned members for a given amount of minutes',
				usage: '[minutes] <member1> [member2 ...]',
				examples: ['mute @Person1', 'mute 5 @Person1 @Person2']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.MANAGE_GUILD],
			args: [
				{
					id: 'members',
					type: ArgConsts.MEMBERS,
					message: 'Please mention members to mute'
				},
				{
					id: 'duration',
					type: ArgConsts.DURATION,
					optional: true,
					default: () => null
				},
				{
					id: 'reason',
					type: ArgConsts.TEXT,
					optional: true,
					default: () => 'No reason provided'
				},
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false,
		});
	}

	async run(message, args) {
		const result = {p: [], f: [], duration: args.duration, reason: args.reason};

		if (args.duration) {
			result.duration = moment().add(args.duration);
		}

		const role = await (async guild => {
			const role = await mutedRole.getMutedRole(guild);

			if (role) {
				return role;
			}

			const newRole =  await mutedRole.setNewMutedRole(guild);
			await this.sendNotice(message, `Muted role not found, created new role ${newRole.toString()}`);
			return newRole;
		})(message.guild);

		await Promise.all(args.members.map(async m => {
			try {
				await m.roles.add(role, args.reason);
			} catch (error) {
				return result.f.push({member: m, reason: error.message});
			}

			result.p.push(m);

			if (args.duration) {
				await muteHandler.muteMember(message.guild, m, role, args.reason, result.duration);
			}

			this.client.emit('guildMemberMuted', m, args.duration, message.member);
		}));

		return result;
	}

	async ship(message, result) {
		const color = ((res) => {
			if (!res.f.length) {
				return 'GREEN';
			}

			if (res.p.length) {
				return 'ORANGE';
			}

			return 'RED';
		})(result);

		const embed = new MessageEmbed()
			.setColor(color);
			// .addField('Moderator', message.member.toString(), true);

		if (result.p.length) {
			const duration = result.duration ? result.duration.fromNow().replace('in', 'for') : 'Forever';
			embed.addField(`Muted ${duration}`, result.p.map(p => p.toString()).join(' '));
		}

		if (result.f.length) {
			embed.addField('Failed', result.f.map(p => `${p.member.toString()} - ${p.reason}`).join('\n'));
		}

		if (result.reason) {
			embed.addField('Reason', result.reason, true);
		}

		// embed.addField('Duration', result.duration ? result.duration.fromNow().replace('in', 'for') : 'Forever');

		return message.channel.send(embed);
	}
};
