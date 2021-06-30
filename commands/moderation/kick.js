const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts, ECommand} = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases: ['kick'],
			description: {
				content: 'Kicks a member.',
				usage: '<member> [member2...] [reason]',
				examples: ['kick @member', 'kick @member1 @member2', 'kick 275331662865367040'],
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

};
