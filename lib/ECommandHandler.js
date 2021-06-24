const fs = require('fs');
const { join } = require('path');
const { Collection, MessageEmbed } = require('discord.js');

const ECommand = require('./ECommand');

class ECommandHandler {
	constructor(client, options = {
		prefix: ';',
		path: './',
	}) {
		this.client = client;
		this.prefix = options.prefix;
		this.path = options.path;

		this.modules = new Collection();
		this.commands = new Collection();

		this.loadModules();
		// this.client.on('message', m => this.handle(m));
	}

	loadModules() {
		const modules = fs.readdirSync(this.path, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => d.name);

		modules.forEach(m => {
			const path = join(this.path, m);

			const commands = fs.readdirSync(path)
				.filter(f => f.endsWith('.js'))
				.map(f => ({name: f, module: require(join(path, f))}));

			const parsedCommands = commands.map(({name, module}) => {
				if (!(module.prototype instanceof ECommand)) {
					// console.warn(`Incompatible module found: ${name} in ${path}`);
					return;
				}

				const command = new module(this.client);
				command.module = m;

				console.log(`Loaded command ${name}`);

				if (!command.aliases.length) {
					this.commands.set(command.name, command);
					return;
				}

				command.aliases.forEach(a => this.commands.set(a, command));

				return command;
			}).filter(i => i);

			if (!parsedCommands.length) {
				return;
			}

			this.modules.set(m, parsedCommands);
		});
	}

	async handle(message) {
		if (message.type !== 'DEFAULT') {
			return;
		}

		// Does not start with prefix, ignore
		if (!message.content.startsWith(this.prefix)) {
			return;
		}

		// Message sent by a bot, ignore. Handles self as well
		if (message.author.bot) {
			return;
		}

		// Ignore partial messages?
		if (message.partial) {
			return;
		}

		const sliced = message.content.slice(this.prefix.length).split(/\s+/);

		const commandName = sliced.shift();
		const args = sliced.join(' ');
		const command = this.commands.get(commandName);

		// Not a command
		if (!command) {
			return;
		}

		if (command.ownerOnly) {
			if (!this.client.ownerIDs.includes(message.author.id)) {
				return message.channel.send(new MessageEmbed()
					.setColor('RED')
					.setTitle('This command is for bot owners only')
				);
			}
		}

		if (command.guildOnly && !message.guild) {
			return;
		}

		// Client permissions check
		const missingClientPerms = message.guild.me.permissions.missing(command.clientPermissions);

		if (missingClientPerms.length) {
			return message.channel.send(new MessageEmbed()
				.setColor('RED')
				.addField('I need the following permissions to execute this command', missingClientPerms)
			);
		}

		// User permissions check
		// Hopefully by this point the owner is verified
		if (!command.ownerOnly) {
			const missingUserPerms = message.member.permissions.missing(command.userPermissions);

			if (missingUserPerms.length) {
				return message.channel.send(new MessageEmbed()
					.setColor('RED')
					.addField('You need the following permissions to execute this command', missingUserPerms)
				);
			}
		}

		// Other inhibitors

		// @everyone removal somewhere

		// token removal somewhere

		// Refresh cache
		if (command.fetchMembers) {
			await message.guild.fetch();
		}

		if (command.cached) {
			// idk
			const cached = command._cache.get(args);

			if (cached) {
				return message.channel.send(cached);
			}
		}

		try {
			await command.execute(message, args || '');
		} catch (err) {
			// Check if our own error, print Unknown Error otherwise
			const embed = command.makeError(err.message || err || 'An unknown error occurred');
			message.channel.send(embed).catch(console.warn);
		}
	}
}

// Will add a separate registry later
// What did I mean by "registry"?
module.exports = ECommandHandler;
