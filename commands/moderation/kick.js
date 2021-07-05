const {Permissions}									= require('discord.js');
const {ArgConsts}									= require('../../lib');
const {ModerationCommand, ModerationCommandResult}	= require('../../modules/moderation');

module.exports = class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName: 'kick',
			aliases: ['kick'],
			description: {
				content:	'Kicks a member.',
				usage:		'<member> [member2...] [reason]',
				examples:	['kick @member', 'kick @member1 @member2', 'kick 275331662865367040'],
			},
			userPermissions:	[Permissions.FLAGS.KICK_MEMBERS],
			clientPermissions:	[Permissions.FLAGS.KICK_MEMBERS],
			args: [
				{
					id:			'members',
					type:		ArgConsts.MEMBERS,
					message:	'Please mention members to kick'
				},
				{
					id:			'reason',
					type:		ArgConsts.REASON,
					optional:	true,
					default:	() => 'No reason provided'
				},
			],
			guildOnly: true,
			ownerOnly: false,
		});
	}

	async run(message, {members, reason}) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(members.map(async m => {
			if (!m.kickable) {
				return result.addFailed(m, 'Member too high in the hierarchy');
			}

			try {
				await m.kick(reason);
			} catch (err) {
				return result.addFailed(m, err.message);
			}

			result.addPassed(m);
		}));

		return result;
	}
};
