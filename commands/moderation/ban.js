import { PermissionsBitField } from 'discord.js';
import { ArgConsts }           from '../../lib/index.js';
import { ModerationCommand }   from '../../modules/moderation/index.js';
import { banUsers }            from './util.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'ban',
			aliases:           ['ban', 'b', 'deport'],
			description:       {
				content:  'Bans a user.',
				usage:    '<user> [user2...] [reason]',
				examples: ['ban @user', 'ban @user1 @user2', 'ban 275331662865367040'],
			},
			userPermissions:   [PermissionsBitField.Flags.BanMembers],
			clientPermissions: [PermissionsBitField.Flags.BanMembers],
			args:              [
				{
					id:          'users',
					type:        ArgConsts.TYPE.USERS,
					description: 'User to ban',
					message:     'Please mention users to ban'
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					description: 'Reason for the ban',
					optional:    true,
					defaultFunc: () => null,
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { users, reason }) {
		return banUsers({ message, users, reason, deleteMessageSeconds: 0 });
	}
}
