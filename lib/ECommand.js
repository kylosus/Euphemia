const { Collection, MessageEmbed, Permissions } = require('discord.js');
const EmbedLimits = require('./EmbedLimits');

const ArgumentParser = require('./Argument/ArgumentParser');

class ECommand {
	constructor(client, options = {
		aliases: [],
		description: {
			content: 'No info provided',
			usage: 'No info provided',
			examples: []
		},
		userPermissions: [],
		clientPermissions: [Permissions.FLAGS.EMBED_LINKS],
		args: [],
		guildOnly: true,
		nsfw: false,
		ownerOnly: true,
		rateLimited: false,
		rateLimit: {
			every: 1
		},
		fetchMembers: false,
		cached: false
	}) {
		this.client = client;
		this.aliases = options.aliases;
		this.description = options.description;
		this.userPermissions = new Permissions(options.userPermissions);
		this.clientPermissions = new Permissions(options.clientPermissions);
		this.args = options.args;
		this.guildOnly = options.guildOnly;
		this.nsfw = options.nsfw;
		this.ownerOnly = options.ownerOnly;
		this.rateLimited = options.rateLimited;
		this.rateLimit = options.rateLimit;

		if (options.fetchMembers && !this.guildOnly) {
			throw new Error('Cannot have fetchUsers and !guildOnly');
		}

		this.fetchMembers = options.fetchMembers;

		this.cached = options.cached;
		this._cache = this.cached ? new Collection() : null;

		this.parser = new ArgumentParser(this.args);
	}

	// Returns a string or an array or something
	async run() {
		throw new Error(`run() is not implemented for ${this.aliases}`);
	}

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

}

module.exports = ECommand;