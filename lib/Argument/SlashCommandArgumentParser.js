import { ApplicationCommandOptionType, Collection } from 'discord.js';

const djsArgumentsShitters                                         = [];
djsArgumentsShitters[ApplicationCommandOptionType.Attachment]      = 'attachment';
djsArgumentsShitters[ApplicationCommandOptionType.Boolean]         = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.Channel]         = 'channel';
djsArgumentsShitters[ApplicationCommandOptionType.Integer]         = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.Mentionable]     = 'value';		// bad stuff
djsArgumentsShitters[ApplicationCommandOptionType.Number]          = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.Role]            = 'role';
djsArgumentsShitters[ApplicationCommandOptionType.String]          = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.Subcommand]      = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.SubcommandGroup] = 'value';
djsArgumentsShitters[ApplicationCommandOptionType.User]            = 'user';

export default class SlashCommandArgumentParser {
	constructor(args) {
		this.args = new Collection(args.map(a => [a.id, a]));
	}

	async parse(interaction) {
		let defaultedArgs = {};

		for (const [k, v] of this.args.filter(a => a.optional)) {
			defaultedArgs[k] = v.defaultFunc(interaction);
		}

		// Incredible coding, courtesy of djs
		defaultedArgs = interaction.options.data.reduce((map, option) => {
			const commandArg = this.args.get(option.name);

			let arg;

			if (commandArg.type.member) {
				arg = option.member;
			} else {
				arg = option[djsArgumentsShitters[option.type]];
			}

			// If this argument needs multiple values
			if (commandArg.type.multiple) {
				arg = [arg];
			}

			map[option.name] = arg;

			return map;
		}, defaultedArgs);

		return defaultedArgs;
	}
}
