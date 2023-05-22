import { codeBlock, PermissionsBitField } from 'discord.js';
import { ArgConsts, AutoEmbed, ECommand } from '../../lib/index.js';
import process                            from 'node:process';

// Helper stuff
// eslint-disable-next-line no-unused-vars
import got                                from 'got';
import { EmbedError }                     from '../../lib/Error/index.js';

// Is this a good idea? Why not just have a method in ECommand?
class EvalEmbedError extends EmbedError {
	constructor(message) {
		super(message);
	}

	makeEmbed() {
		return this.baseEmbed
			.setTitle('Error while evaluating:')
			.setDescription(codeBlock(this.message));
	}
}

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['eval'],
			description:     {
				content:  'Evaluates JavaScript code',
				usage:    '<code>',
				examples: ['eval return 1 + 1', 'eval message.delete()']
			},
			userPermissions: [PermissionsBitField.Flags.Administrator],
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
		const start = process.hrtime();

		let result = '*No output*';

		try {
			result = await eval(
				`(async () => {
					${code}
				})();`
			) ?? result;
		} catch (err) {
			throw new EvalEmbedError(err);
		}

		const elapsed = process.hrtime(start)[1] / 1000000;	// millisecond

		return [elapsed, result];
	}

	async ship(message, [elapsed, result]) {
		return message.reply({
			embeds: [new AutoEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setTitle(`Evaluated in ${elapsed}ms.`)
				.setDescriptionWrap(JSON.stringify(result, null, 4))]
		});
	}
}
