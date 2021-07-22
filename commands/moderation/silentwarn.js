const { Permissions }                                = require('discord.js');
const { ArgConsts }                                  = require('../../lib');
const { ModerationCommand, ModerationCommandResult } = require('../../modules/moderation');

module.exports = class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:      'warn',
			aliases:         ['silentwarn'],
			description:     {
				content:  'Warns a member without sending a DM.',
				usage:    '<member> [member2...] <reason>',
				examples: ['warn @member Some reason', 'warn @member1 @member2 Some other reason']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:      'members',
					type:    ArgConsts.MEMBERS,
					message: 'Please mention members to warn'
				},
				{
					id:      'reason',
					type:    ArgConsts.REASON,
					message: 'Please add a reason'
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		// some this context closure crap idk
		members.forEach(m => result.addPassed(m));

		return result;
	}
};
