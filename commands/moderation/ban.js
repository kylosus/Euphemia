import { EmbedBuilder, PermissionsBitField }          from 'discord.js';
import { ArgConsts }                                  from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult } from '../../modules/moderation/index.js';

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
					id:      'users',
					type:    ArgConsts.TYPE.USERS,
					message: 'Please mention users to ban'
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null,
				},
			],
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { users, reason }) {
		const result = new ModerationCommandResult(reason);

		await Promise.all(users.map(async user => {
			const member = await message.guild.members.fetch({ user }).catch(() => {
			});

			if (member && !member.bannable) {
				return result.addFailed(user, 'Member too high in the hierarchy');
			}

			try {
				await message.guild.members.ban(user.id, { deleteMessageDays: 0, reason });
			} catch (err) {
				return result.addFailed(user, err.message);
			}

			result.addPassed(user);
		}));

		return result;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.getColor())
			.setTitle('Users have been tragically obliterated')
			.setImage('https://cdn.discordapp.com/attachments/420272882900533248/1018256667122597888/unknown.png');

		if (result.aux) {
			embed.setDescription(result.aux.toString());
		}

		embed.addFields({ name: 'Casualties', value: result.passed.map(r => r.toString()).join(' ') || '~' });

		if (result.failed.length) {
			embed.addFields({
				name:  'Survivors',
				value: result.failed.map(r => `${r.toString()} - ${r.reason || '**Unknown reason**'}`).join(' ')
			});
		}

		embed.addFields(
			{ name: 'Moderator', value: message.member.toString(), inline: true },
			{ name: 'Reason', value: result?.reason ?? '*No reason provided*', inline: true }
		);

		return message.channel.send({ embeds: [embed] });
	}
}
