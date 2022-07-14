import { Formatters, MessageEmbed, Permissions } from 'discord.js';
import { ArgConsts, AutoEmbed, ECommand }        from '../../lib/index.js';
import process                                   from 'node:process';

// Helper stuff
// eslint-disable-next-line no-unused-vars
import got                                       from 'got';

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['eval'],
			description:     {
				content:  'Evaluates JavaScript code',
				usage:    '<code>',
				examples: ['eval return 1 + 1', 'eval message.delete()']
			},
			userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
			args:            [
				{
					id:      'code',
					type:    ArgConsts.TYPE.TEXT,
					message: 'Please provide code'
				}
			],
			guildOnly:       false,
			ownerOnly:       true,
		});
	}

	async run(message, { code }) {
		const start   = process.hrtime();
		const result  = await eval(
			`(async () => {
				${code}
			})();`
		).catch(err => { throw typeof err === 'string' ? err : err.message; }) ?? '*No output*';
		const elapsed = process.hrtime(start)[1] / 1000000;	// millisecond

		return [elapsed, result];
	}

	makeError(string) {
		return new MessageEmbed()
			.setColor(this.client.config.COLOR_NO)
			.setTitle('Error while evaluating:')
			.setDescription(Formatters.codeBlock(string));
	}

	async ship(message, [elapsed, result]) {
		return message.channel.send({
			embeds: [new AutoEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setTitle(`Evaluated in ${elapsed}ms.`)
				.setDescriptionWrap(JSON.stringify(result, null, 4))]
		});
	}
}
