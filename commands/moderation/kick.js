const {MessageEmbed, Permissions} = require('discord.js');

const ECommand = require('../../lib/ECommand');
const ArgConsts = require('../../lib/Argument/ArgumentTypeConstants');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['kick'],
			description: {
				content: 'Kicks a member.',
				usage: '<member> [reason]',
				examples: ['kick @user', 'kick 275331662865367040'],
			},
			userPermissions: [Permissions.FLAGS.KICK_MEMBERS],
			clientPermissions: [Permissions.FLAGS.KICK_MEMBERS],
			args: [
				{
					id: 'members',
					type: ArgConsts.MEMBERS,
					message: 'Please mention members to kick'
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
		const result = {p: [], f: [], reason: args.reason};

		await Promise.all(args.members.map(async m => {
			if (!m.kickable) {
				return result.f.push({member: m, reason: 'Member too high in the hierarchy'});
			}

			try {
				await m.kick(args.reason);
			} catch (err) {
				return result.f.push({member: m, reason: err.message || 'Unknown error'});
			}

			result.p.push(m);
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

		return message.channel.send(new MessageEmbed()
			.setColor(color)
			.addField('Kicked', result.p.map(p => p.toString()).join(' ') || '~')
			.addField('Failed', result.f.map(p => `${p.member.toString()} - ${p.reason}`).join('\n') || '~')
			.addField('Moderator', message.member.toString(), true)
			.addField('Reason', result.reason || '~', true)
		);
	}
};
