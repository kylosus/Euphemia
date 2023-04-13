import { PermissionsBitField }      from 'discord.js';
import { ArgConsts }                from '../../lib/index.js';
import { ModerationCommand }        from '../../modules/moderation/index.js';
import { banUsers, DELETE_SECONDS } from './util.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'banprune',
			aliases:           ['banprune', 'bp'],
			description:       {
				content:  'Re-bans a user to prune their messages. Use during raids',
				usage:    '<user> [user2...] [reason]',
				examples: ['banprune @user', 'banprune @user Spammed in general'],
			},
			userPermissions:   [PermissionsBitField.Flags.BanMembers],
			clientPermissions: [PermissionsBitField.Flags.BanMembers],
			args:              [
				{
					id:          'users',
					type:        ArgConsts.TYPE.USERS,
					description: 'User to ban',
					message:     'Please mention users to prune'
				},
				{
					id:          'reason',
					type:        ArgConsts.TYPE.REASON,
					description: 'Reason for the ban',
					optional:    true,
					defaultFunc: () => null,
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
			slash:             true
		});
	}

	async run(message, { users, reason }) {
		return banUsers({ message, users, reason, deleteMessageSeconds: DELETE_SECONDS });
	}

}
