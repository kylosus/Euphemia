import { codeBlock, EmbedBuilder } from 'discord.js';
import { ArgConsts, ECommand }     from '../../lib/index.js';
import { capitalize }              from '../../lib/util/StringDoctor.js';
import pjson                       from '../../package.json' assert { type: 'json' };

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['help', 'h'],
			description: {
				content:  'Lists available commands.',
				usage:    '[command/module]',
				examples: ['help', 'help ping'],
			},
			args:        [
				{
					id:          'command',
					type:        ArgConsts.TYPE.TEXT,
					description: 'Name of the command',
					optional:    true,
					defaultFunc: () => null
				},
			],
			guildOnly:   false,
			ownerOnly:   false,
			cached:      true
		});
	}

	async run(message, { command }) {
		if (!command) {
			return null;
		}

		const c = this.client.commandHandler.commands.get(command);

		if (!c) {
			throw `Command ${command} not found`;
		}

		return c;
	}

	async ship(message, result) {
		const embed = new EmbedBuilder()
			.setColor(this.client.config.COLOR_OK)
			.setThumbnail(message.client.user.displayAvatarURL());

		if (!result) {
			embed
				.addFields({ name: '\u200B', value: '\u200B' })
				.setTitle(`${message.client.user.username} commands`)
				.setThumbnail(message.client.user.displayAvatarURL())
				.setColor(this.client.config.COLOR_OK)
				.addFields({ name: '\u200B', value: '\u200B' })
				.setFooter({ text: `♥ Made with love by ${pjson.author}` });

			this.client.commandHandler.modules.forEach((module, name) => {
				embed.addFields(
					{
						name:  `${capitalize(name)} commands:`,
						value: module.map(command => `**${command.aliases[0]}**: ${command.description.content}`).join('\n')
					},
					{ name: '\u200B', value: '\u200B' }
				);
			});

			return message.reply({ embeds: [embed] });
		}

		embed.setTitle(`Command name: ${result.aliases.join('/')}`);
		embed.setDescription(result.description.content);

		if (result.description.usage.length) {
			embed.addFields({ name: 'Arguments', value: codeBlock(result.description.usage) });
		}

		embed.addFields({ name: 'Usage', value: codeBlock(result.description.examples.join('\n')) });

		return message.reply({ embeds: [embed] });
	}
}
