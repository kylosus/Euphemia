import { PermissionsBitField }                        from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:              'warn',
			aliases:                 ['silentwarn', 'warnsilent'],
			description:             {
				content:  'Warns a member without sending a DM.',
				usage:    '<member> [member2...] <reason>',
				examples: ['silentwarn @member Some reason', 'silentwarn @member1 @member2 Some other reason']
			},
			userPermissions: [PermissionsBitField.Flags.ManageGuild],
			args:                    [
				{
					id:      'members',
					type:    ArgConsts.TYPE.MEMBERS,
					message: 'Please mention members to warn'
				},
				{
					id:      'reason',
					type:    ArgConsts.TYPE.REASON,
					message: 'Please add a reason'
				}
			],
			guildOnly:               true,
			ownerOnly:               false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		// some this context closure crap idk
		members.forEach(m => result.addPassed(m));

		return result;
	}
}
