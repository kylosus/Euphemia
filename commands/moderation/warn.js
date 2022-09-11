import { codeBlock, EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts }                                    from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult }   from '../../modules/moderation/index.js';

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:      'warn',
			aliases:         ['warn'],
			description:     {
				content:  'Warns a member.',
				usage:    '<member> [member2...] <reason>',
				examples: ['warn @member Some reason', 'warn @member1 @member2 Some other reason']
			},
			// For Valk
			userPermissions: [PermissionsBitField.Flags.ManageRoles],
			args:            [
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
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { members, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(members.map(async m => {
			try {
				await m.user.send({
					embeds: [new EmbedBuilder()
						.setColor(this.client.config.COLOR_NO)
						.setTitle(`❗ You have been warned in ${message.guild}`)
						.setDescription(codeBlock(reason))]
				});
			} catch (err) {
				return result.addFailed(m, err.message);
			}

			result.addPassed(m);
		}));

		return result;
	}
}
