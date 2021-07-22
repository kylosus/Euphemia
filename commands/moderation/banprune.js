const { Permissions }                                = require('discord.js');
const { ArgConsts }                                  = require('../../lib');
const { ModerationCommand, ModerationCommandResult } = require('../../modules/moderation');

module.exports = class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'banprune',
			aliases:           ['banprune', 'bp'],
			description:       {
				content:  'Re-bans a user to prune their messages. Use during raids',
				usage:    '<user> [reason]',
				examples: ['banprune @user', 'banprune @user Spammed in general'],
			},
			userPermissions:   [Permissions.FLAGS.BAN_MEMBERS],
			clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			args:              [
				{
					id:      'id',
					type:    ArgConsts.ID,
					message: 'Please mention a user to prune'
				},
				{
					id:       'reason',
					type:     ArgConsts.REASON,
					optional: true,
					default:  () => null,
				}
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { id, reason }) {
		const result = new ModerationCommandResult(reason);

		try {
			await message.guild.members.ban(id, {
				days: 1,
			});

			result.addPassed(id);
		} catch (err) {
			result.addFailed(id, err.message);
		}

		return result;
	}
};
