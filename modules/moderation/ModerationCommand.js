import { MessageEmbed }                 from 'discord.js';
import { ECommand, StringDoctor as SD } from '../../lib/index.js';

import { bulkInsert } from './db.js';

export default class ModerationCommand extends ECommand {
	constructor(client, {
		actionName = (() => {throw 'Moderation commands need an actionName option';})(), ...options
	}) {
		super(client, options);

		this.actionName = actionName.toUpperCase();

		if (!this.args.find(arg => arg.id === 'reason')) {
			throw 'Need reason argument in Moderation Commands';
		}
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(result.getColor())
			.setTitle(`${capitalize(this.aliases[0])} command executed`);

		if (result.aux) {
			embed.setDescription(result.aux.toString());
		}

		embed.addField('Passed', result.passed.map(r => `<@${r.id}>`).join(' ') || '~');

		if (result.failed.length) {
			embed.addField('Failed', result.failed.map(r => `<@${r.id}> - ${r.reason || '**Unknown reason**'}`).join(' '));
		}

		embed.addField('Moderator', message.member.toString(), true);
		embed.addField('Reason', result?.reason ?? '*No reason provided*', true);

		return message.channel.send(embed);
	}

	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result     = await this.run(message, parsedArgs);

		this.record(message.guild, message.member, result)
			.then(r => r.forEach(r => this.client.emit('modAction', message.guild, message.member, r)))
			.catch(err => this.client.emit('error', err));

		const reply = await this.ship(message, result);

		this.hooks.forEach(h => h(reply));
		return reply;
	}

	async record(guild, moderator, { aux, reason, ...result }) {
		const passed = result.passed.map(r => ({
			guild:        guild.id,
			action:       this.actionName,
			moderator:    moderator.id,
			target:       r?.id ?? r,
			aux,
			reason,
			passed:       true,
			failedReason: null
		}));

		const failed = result.failed.map(r => ({
			guild:        guild.id,
			action:       this.actionName,
			moderator:    moderator.id,
			target:       r?.id ?? r,
			aux,
			reason,
			passed:       false,
			failedReason: r.reason
		}));

		const all = passed.concat(failed);
		bulkInsert(all).catch(console.error);
		return all;
	}
}
