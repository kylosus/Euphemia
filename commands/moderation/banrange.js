import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } from 'discord.js';
import { ArgConsts, AutoEmbed }                                              from '../../lib/index.js';
import { ModerationCommand, ModerationCommandResult }                        from '../../modules/moderation/index.js';

const PROMPT_YES         = 'YES';
const PROMPT_NO          = 'NO';
const MAX_BANNABLE_USERS = 150;

export default class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName:        'banrange',
			aliases:           ['banrange', 'rangeban'],
			description:       {
				content:  'Bans every user joined within a range. Useful for mass bot joins',
				usage:    '[user2...] [reason]',
				examples: ['banrange 12345678', 'banrange 12345678 12345679'],
			},
			userPermissions:   [PermissionsBitField.Flags.BanMembers],
			clientPermissions: [PermissionsBitField.Flags.BanMembers],
			args:              [
				{
					id:      'from',
					type:    ArgConsts.TYPE.MEMBER,
					message: 'Please enter the ID of the first user that joined'
				},
				{
					id:       'to',
					type:     ArgConsts.TYPE.MEMBER,
					optional: true,
					default:  message => message.guild.members.cache
						.reduce(
							(acc, m) => m.joinedTimestamp > acc.joinedTimestamp ? m : acc,
							message.guild.members.cache.last()
						)
				},
				{
					id:       'reason',
					type:     ArgConsts.TYPE.REASON,
					optional: true,
					default:  () => null,
				},
			],
			fetchMembers:      true,
			guildOnly:         true,
			ownerOnly:         false,
		});
	}

	async run(message, { from, to, reason }) {
		[from, to] = [from, to].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

		let range = message.guild.members.cache
			.filter(({ joinedTimestamp: jts }) => jts >= from.joinedTimestamp)
			.filter(({ joinedTimestamp: jts }) => jts <= to.joinedTimestamp);

		if (range.size > MAX_BANNABLE_USERS) {
			throw `I cannot ban more than ${MAX_BANNABLE_USERS} users at a time.`;
		}

		const buttons = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder({
					customId: PROMPT_YES,
					label:    PROMPT_YES,
					style:    ButtonStyle.Danger
				}),
				new ButtonBuilder({
					customId: PROMPT_NO,
					label:    PROMPT_NO,
					style:    ButtonStyle.Danger
				})
			]);

		const sent = await message.channel.send({
			embeds:     [new AutoEmbed()
				.setColor(this.client.config.COLOR_WARN)
				.setTitle(`I am about to ban ${range.size} users. Are you sure?`)
				.setDescription(range.map(m => `${m.toString()}${m.user.tag}`).join('\n'))],
			components: [buttons]
		});

		let interaction = null;

		try {
			interaction = await sent.awaitMessageComponent({
				filter: interaction => interaction.isButton() && interaction.user.id === message.author.id,
				time:   15_000
			});
		} catch (err) {
			throw 'Cancelled';
		}

		interaction.deferUpdate().catch(() => {});

		if (interaction.customId !== PROMPT_YES) {
			throw 'Cancelled';
		}

		const result = new ModerationCommandResult(reason);

		await Promise.all(range.map(async m => {
			if (!m.bannable) {
				return result.addFailed(m, 'Member too high in the hierarchy');
			}

			try {
				await m.ban({ deleteMessageDays: 0, reason });
			} catch (err) {
				return result.addFailed(m, err.message);
			}

			result.addPassed(m);
		}));

		return result;
	}
}
