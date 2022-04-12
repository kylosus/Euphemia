import { Collection, MessageEmbed, Permissions } from 'discord.js';

import ArgumentParser from './Argument/ArgumentParser.js';

const EMOJI_NO = '❌';

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

		this.cached = cached;
		this._cache = this.cached ? new Collection() : null;

		this.hooks = [];

		if (deleteAfter) {
			// TS when
			if (isNaN(deleteAfter)) {
				throw 'Please provide a number for deleteAfter';
			}

			this.hooks.push(async m => {
				const _m = await m;
				_m.client.setTimeout(() => {
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
	async run() {}

	// Override this
	async ship(message, result) {
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)]
		});
	}

	makeError(string) {
		return new MessageEmbed().setColor('RED').setDescription(`${EMOJI_NO} ${string}`);
	}

	async sendNotice(message, string) {
		return message.channel.send({ embeds: [new MessageEmbed().setColor('GREEN').setDescription(string)] });
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
}
