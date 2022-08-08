import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { ArgConsts, ECommand }               from '../../lib/index.js';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['dm', 'message'],
			description:     {
				content:  'DMs users. Supports embeds',
				usage:    '<user> [user2...] <text>',
				examples: ['dm 275331662865367040 something', 'dm @user1 @user2 {JSON}']
			},
			userPermissions: [PermissionsBitField.Flags.ManageMessages],
			args:            [
				{
					id:      'users',
					type:    ArgConsts.TYPE.USERS,
					message: 'Please mention users to DM to'
				},
				{
					id:      'text',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide text'
				}
			],
			guildOnly:       false,
			ownerOnly:       true,
		});
	}

	async run(message, { users, text }) {
		const [content, embed] = await (async () => {
			try {
				const json  = JSON.parse(text);
				const embed = new EmbedBuilder(json);
				await message.channel.send({ embeds: [embed] });
				return [json.content, embed];
			} catch (err) {
				return [text, null];
			}
		})();

		const result = { p: [], f: [] };

		await Promise.all(users.map(async u => {
			try {
				await u.send({ content, embeds: [embed] });
				return result.p.push(u);
			} catch (err) {
				return result.f.push({ user: u, reason: err.message || 'Unknown error' });
			}
		}));

		return result;
	}

	async ship(message, result) {
		const color = ((res) => {
			if (!res.f.length) {
				return 'GREEN';
			}

			if (res.p.length) {
				return 'ORANGE';
			}

			return 'RED';
		})(result);

		return message.channel.send({
			embeds: [new EmbedBuilder()
				.setColor(color)
				.addFields(
					{
						name:  `Sent to ${result.p.length} users`,
						value: result.p.map(p => p.toString()).join(' ') || '~'
					},
					{
						name:  'Failed',
						value: result.f.map(f => `${f.user.toString()} - ${f.reason}`).join('\n') || '~'
					}
				)
			]
		});
	}
}
