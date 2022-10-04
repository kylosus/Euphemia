import { PermissionsBitField } from 'discord.js';
import { ArgConsts }           from '../../lib/index.js';
import { ModerationCommand }   from '../../modules/moderation/index.js';
import { banUsers }            from './util.js';

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
					id:      'users',
					type:    ArgConsts.TYPE.USERS,
					message: 'Please mention users to prune'
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null,
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { users, reason }) {
		return banUsers({ message, users, reason, deleteMessageDays: 1 });
	}

}
