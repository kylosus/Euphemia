import { BotConfig }                             from '../config.js';
import { Collection, MessageEmbed, Permissions } from 'discord.js';
import ArgumentParser                            from './Argument/ArgumentParser.js';

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
		userPermissions = [],
		clientPermissions = [Permissions.FLAGS.EMBED_LINKS],
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
	}) {
		this.client            = client;
		this.aliases           = aliases;
		this.description       = description;
		this.userPermissions   = new Permissions(userPermissions);
		this.clientPermissions = new Permissions(clientPermissions);
		this.args              = args;
		this.guildOnly         = guildOnly;
		this.nsfw              = nsfw;
		this.ownerOnly         = ownerOnly;
		this.rateLimited       = rateLimited;
		this.rateLimit         = rateLimit;
		this.typing            = typing;
		this.disabled          = disabled;

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

		this.parser = new ArgumentParser(this.args);
	}

	get name() {
		return this.aliases[0];
	}

	// Returns a string or an array or something
	async run() {
	}

	// Override this
	async ship(message, result) {
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setColor(this.client.config.COLOR_OK)
				.setDescription(result)]
		});
	}

	async sendNotice(message, string) {
		return message.channel.send({ embeds: [new MessageEmbed().setColor(this.client.config.COLOR_OK).setDescription(string)] });
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
	return new MessageEmbed().setColor(BotConfig.COLOR_NO).setDescription(`${BotConfig.EMOJI_NO} ${string}`);
};
