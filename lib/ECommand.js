const { Collection, MessageEmbed, Permissions } = require('discord.js');
const EmbedLimits = require('./EmbedLimits');

const ArgumentParser = require('./Argument/ArgumentParser');

class ECommand {
	constructor(client, {
		aliases = [],
		description = {
			content: 'No info provided',
			usage: 'No info provided',
			examples: []
		},
		userPermissions = [],
		clientPermissions=  [Permissions.FLAGS.EMBED_LINKS],
		args = [],
		guildOnly = true,
		nsfw = false,
		ownerOnly = true,
		rateLimited = false,
		rateLimit = {
			every: 1
		},
		fetchMembers = false,
		cached = false
	}) {
		this.client = client;
		this.aliases = aliases;
		this.description = description;
		this.userPermissions = new Permissions(userPermissions);
		this.clientPermissions = new Permissions(clientPermissions);
		this.args = args;
		this.guildOnly = guildOnly;
		this.nsfw = nsfw;
		this.ownerOnly = ownerOnly;
		this.rateLimited = rateLimited;
		this.rateLimit = rateLimit;

		if (fetchMembers && !this.guildOnly) {
			throw new Error('Cannot have fetchUsers and !guildOnly');
		}

		this.fetchMembers = fetchMembers;

		this.cached = cached;
		this._cache = this.cached ? new Collection() : null;

		this.parser = new ArgumentParser(this.args);
	}

	// Returns a string or an array or something
	async run() {}

	// Override this
	async ship(message, result) {
		return message.channel.send(
			new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)
		);
	}

	makeError(string) {
		if (string.length <= EmbedLimits.TITLE) {
			return new MessageEmbed().setColor('RED').setTitle(string);
		}

		return new MessageEmbed().setColor('RED').setDescription(string);
	}

	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result = await this.run(message, parsedArgs);
		const reply = await this.ship(message, result);
		return reply;
	}

}

module.exports = ECommand;