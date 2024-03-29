import { BotConfig }                                     from '../config/config.js';
import { Collection, EmbedBuilder, PermissionsBitField } from 'discord.js';
import ArgumentParser                                    from './Argument/ArgumentParser.js';
import SlashCommandArgumentParser                        from './Argument/SlashCommandArgumentParser.js';
import { Argument }                                      from './Argument/index.js';

export default class ECommand {
	// Fixes some stuff
	client;

	constructor(client, {
		aliases = [],
		description = {
			content:  'No info provided',
			usage:    'No info provided',
			examples: ['']
		},
		userPermissions = [PermissionsBitField.Flags.UseApplicationCommands],
		clientPermissions = [PermissionsBitField.Flags.EmbedLinks],
		args = [],
		guildOnly = true,
		nsfw = false,
		ownerOnly = true,
		rateLimited = false,
		rateLimit = { every: 1 },
		fetchMembers = false,
		typing = false,
		disabled = false,
		cached = false,
		cacheEviction = 600000,	// 10 minutes in milliseconds`
		deleteAfter = null,
		slash = false,
		defer = false,
		ephemeral = false,
	}) {
		this.client            = client;
		this.aliases           = aliases;
		this.description       = description;
		this.userPermissions   = new PermissionsBitField(userPermissions);
		this.clientPermissions = new PermissionsBitField(clientPermissions);
		this.args              = args.map(a => new Argument(a));
		this.guildOnly         = guildOnly;
		this.nsfw              = nsfw;
		this.ownerOnly         = ownerOnly;
		this.rateLimited       = rateLimited;
		this.rateLimit         = rateLimit;
		this.typing            = typing;
		this.disabled          = disabled;
		this.slash             = slash;
		this.defer             = defer;
		this.ephemeral         = ephemeral;

		// For faster lookup
		this.argsMap = new Map(this.args.map(a => [a.id, a]));

		if (fetchMembers && !this.guildOnly) {
			throw new Error('Cannot have fetchUsers and !guildOnly');
		}

		this.fetchMembers = fetchMembers;

		this.cached        = cached;
		this.cacheEviction = cacheEviction;

		if (this.cached) {
			this._cache  = new Collection();
			this.execute = this._executeCache;

			// This is not a true timed cache, it evicts
			// all items every n milliseconds, but it
			// is very simple and works for my purposes.
			// Also, creating a new Map might be better
			// than sweeping with a true predicate
			setInterval(() => {
				this._cache.sweep(() => true);
			}, this.cacheEviction);
		}

		this.hooks = [];

		if (deleteAfter) {
			// TS when
			if (isNaN(deleteAfter)) {
				throw 'Please provide a number for deleteAfter';
			}

			this.hooks.push(async m => {
				const _m = await m;
				setTimeout(() => {
					_m.delete();
				}, deleteAfter);
			});
		}

		// Is this a good idea?
		this.parser             = new ArgumentParser(this);
		this.slashCommandParser = new SlashCommandArgumentParser(this);
	}

	get name() {
		return this.aliases[0];
	}

	// Returns a string or an array or something
	async run() {
	}

	// Override this
	async ship(message, result = '👌') {
		return message.reply({
			ephemeral: this.ephemeral,
			embeds:    [new EmbedBuilder()
				.setColor(this.client.config.COLOR_OK)
				.setDescription(result)]
		});
	}

	async shipInteraction(interaction, result) {
		return this.ship(interaction, result);
	}

	// async sendNoticeInteraction(interaction, ...args) {
	// 	return interaction.followUp(...args);
	// }

	async sendNotice(message, string) {
		return message.reply({ embeds: [new EmbedBuilder().setColor(this.client.config.COLOR_OK).setDescription(string)] });
	}

	async sendNoticeInteraction(interaction, string) {
		return interaction.reply({ embeds: [new EmbedBuilder().setColor(this.client.config.COLOR_OK).setDescription(string)] });
	}

	// ship() should be returning an unsent message, not a Promise
	// so we can apply inhibitors on it
	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result     = await this.run(message, parsedArgs);
		const reply      = this.ship(message, result);
		this.hooks.forEach(h => h(reply));
		return reply;
	}

	async executeSlashCommand(interaction) {
		const parsedArgs = await this.slashCommandParser.parse(interaction);

		if (this.defer) {
			await interaction.deferReply();
			interaction.reply = async (...args) => interaction.followUp(...args);
		}

		const result = await this.run(interaction, parsedArgs);
		const reply  = this.shipInteraction(interaction, result);
		this.hooks.forEach(h => h(reply));
		return reply;
	}

	async _executeCache(message, args) {
		const lowerArgs = args.toLowerCase();

		const cachedResult = this._cache.get(lowerArgs);

		if (cachedResult) {
			const reply = this.ship(message, cachedResult);
			this.hooks.forEach(h => h(reply));
			return reply;
		}

		const parsedArgs = this._cache.get(args) ?? await this.parser.parse(message, args);
		const result     = await this.run(message, parsedArgs);
		const reply      = this.ship(message, result);
		this.hooks.forEach(h => h(reply));

		this._cache.set(lowerArgs, result);

		return reply;
	}
}

export const makeError = string => {
	return new EmbedBuilder().setColor(BotConfig.COLOR_NO).setDescription(`${BotConfig.EMOJI_NO} ${string}`);
};
