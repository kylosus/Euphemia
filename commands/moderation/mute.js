const { MessageEmbed, Permissions } = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['mute'],
			description: {
				content: 'Mutes mentioned members for a given amount of minutes',
				usage: '[minutes] <member1> [member2 ...]',
				examples: ['mute @Person1', 'mute 5 @Person1 @Person2']
			},
			// 	userPermissions: ['MANAGE_ROLES'],
			// 	clientPermissions: ['MANAGE_ROLES', 'MANAGE_GUILD'],
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
					type: ArgConsts.NUMBER,
					optional: true,
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

		const entry = await message.client.provider.get(message.guild, 'mutedRole');

		if (!entry) {
			// Will take care of this later
			throw 'Muted role not found';
		}

		const mutedRole = message.guild.roles.resolve(entry);

		if (!mutedRole) {
			throw 'I cannot mute. Muted role has been deleted';
		}

		await Promise.all(args.members.map(async m => {
			if (m.roles.cache.has(mutedRole.id)) {
				result.f.push({member: m, reason: 'Already muted'});
				return null;
			}

			try {
				await m.roles.add(mutedRole, args.reason);
			} catch (error) {
				return result.f.push({member: m, reason: error.message});
			}

			result.p.push(m);

			this.client.emit('guildMemberMuted', m, args.duration, message.member);

			// guildMemberMuted(member, duration, message.member);

			// TODO: Use a database
			// if (duration) {
			// 	message.client.setTimeout((member, role, guildMemberUnmuted) => {
			// 		member.removeRole(role).then(member => {
			// 			// TODO: replace with Client event
			// 			guildMemberMuted(member, duration);
			// 			guildMemberUnmuted(member);
			// 		});
			// 	}, duration * 60000, member, role, guildMemberUnmuted);
			// }

			// return await member.toString();
		}));

		return new Promise(resolve => resolve(result));

		// if (muted.length) {
		// 	const embed = new RichEmbed()
		// 		.setColor('GREEN')
		// 		.addField('Muted members', muted.join('\n'))
		// 		.addField('Moderator', message.member.toString());
		//
		// 	if (duration) {
		// 		embed.addField('Duration', `${duration} minutes`);
		// 	}
		//
		// 	return message.channel.send(embed);
		// }
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

		return message.channel.send(new MessageEmbed()
			.setColor(color)
			.addField('Muted', result.p.map(p => p.toString()).join(' ') || '~')
			.addField('Failed', result.f.map(p => `${p.member.toString()} - ${p.reason}`).join('\n') || '~')
			.addField('Duration', result.duration || 'Forever')
			// .addField('Moderator', message.member.toString(), true)
			.addField('Reason', result.reason || '~', true)
		);
	}
};
