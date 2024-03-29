import { EmbedBuilder }                 from 'discord.js';
import { ECommand, StringDoctor as SD } from '../../lib/index.js';
import { bulkInsert }                   from './db.js';

export default class ModerationCommand extends ECommand {
	constructor(client, {
		actionName = (() => {
			throw 'Moderation commands need an actionName option';
		})(), ...options
	}) {
		super(client, options);

		this.actionName = actionName.toUpperCase();

		if (!this.args.find(arg => arg.id === 'reason')) {
			throw 'Need reason argument in Moderation Commands';
		}
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(result.getColor())
			.setTitle(`${SD.capitalize(this.aliases[0])} command executed`);

		if (result.aux) {
			embed.setDescription(result.aux.toString());
		}

		embed.addFields({ name: 'Passed', value: result.passed.map(r => r.toString()).join(' ') || '~' });

		if (result.failed.length) {
			embed.addFields({
				name:  'Failed',
				value: result.failed.map(r => `${r.toString()} - ${r.reason || '**Unknown reason**'}`).join(' ')
			});
		}

		embed.addFields(
			{ name: 'Moderator', value: message.member.toString(), inline: true },
			{ name: 'Reason', value: result?.reason ?? '*No reason provided*', inline: true }
		);

		return message.reply({ embeds: [embed] });
	}

	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result     = await this.run(message, parsedArgs);

		this.record(message.guild, message.member, result)
			.then(r => r.forEach(r => this.client.emit('modAction', message.guild, message.member, r)));

		const reply = await this.ship(message, result);

		this.hooks.forEach(h => h(reply));
		return reply;
	}

	async record(guild, moderator, { aux, reason, duration, ...result }) {
		const passed = result.passed.map(r => ({
			guild,
			action:       this.actionName,
			moderator,
			target:       r,
			aux,
			duration,
			reason,
			passed:       true,
			failedReason: null
		}));

		const failed = result.failed.map(r => ({
			guild,
			action:       this.actionName,
			moderator,
			target:       r,
			aux,
			duration,
			reason,
			passed:       false,
			failedReason: r.reason
		}));

		const all   = passed.concat(failed);
		const dbRes = await bulkInsert(all);

		dbRes.forEach((r, i) => {
			all[i].id = r.lastID;
		});

		return all;
	}
}
