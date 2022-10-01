import { ApplicationCommandOptionType, Collection } from 'discord.js';

const discordArgTypeKey                                         = [];
discordArgTypeKey[ApplicationCommandOptionType.Attachment]      = 'attachment';
discordArgTypeKey[ApplicationCommandOptionType.Boolean]         = 'value';
discordArgTypeKey[ApplicationCommandOptionType.Channel]         = 'channel';
discordArgTypeKey[ApplicationCommandOptionType.Integer]         = 'value';
discordArgTypeKey[ApplicationCommandOptionType.Mentionable]     = 'value';		// bad stuff
discordArgTypeKey[ApplicationCommandOptionType.Number]          = 'value';
discordArgTypeKey[ApplicationCommandOptionType.Role]            = 'role';
discordArgTypeKey[ApplicationCommandOptionType.String]          = 'value';
discordArgTypeKey[ApplicationCommandOptionType.Subcommand]      = 'value';
discordArgTypeKey[ApplicationCommandOptionType.SubcommandGroup] = 'value';
discordArgTypeKey[ApplicationCommandOptionType.User]            = 'user';

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
				arg = option[discordArgTypeKey[option.type]];
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
