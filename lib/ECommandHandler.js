const { Collection, MessageEmbed } = require('discord.js');
const ECommand                     = require('./ECommand');
const { wrap }                     = require('./util/StringDoctor');
const fs                           = require('fs');
const { join }                     = require('path');

class ECommandHandler {
	constructor(client, options = {
		prefix: ';',
		path:   './',
	}) {
		this.client = client;
		this.prefix = options.prefix;
		this.path   = options.path;

		this.modules  = new Collection();
		this.commands = new Collection();

		this.loadModules();

		console.log(`Loaded ${this.commands.size} commands`);
	}

	registerCommands(dir, moduleName) {
		const commands = fs.readdirSync(dir)
			.filter(f => f.endsWith('.js'))
			.map(f => ({ name: f, module: require(join(dir, f)) }));

		const parsedCommands = commands.map(({ name, module }) => {
			if (!(module.prototype instanceof ECommand)) {
				return;
			}

			const command  = new module(this.client);
			command.module = moduleName;

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

		this.modules.set(moduleName, parsedCommands);
	}

	loadModules(modulePath = this.path) {
		const modules = fs.readdirSync(modulePath, { withFileTypes: true })
			.filter(d => d.isDirectory())
			.map(d => d.name);

		modules.forEach(m => {
			const path = join(modulePath, m);
			this.registerCommands(path, m);
		});
	}

	sendError(message, error) {
		return message.channel.send(new MessageEmbed()
			.setColor('RED')
			.setDescription(error)
		);
	}

	async handle(message) {
		// Message sent by a bot, ignore. Handles self as well
		if (message.author.bot) {
			return;
		}

		if (message.type !== 'DEFAULT') {
			return;
		}

		// Does not start with prefix, ignore
		if (!message.content.startsWith(this.prefix)) {
			return;
		}

		// Ignore partial messages?
		if (message.partial) {
			return;
		}

		const sliced = message.content.slice(this.prefix.length).split(/\s+/);

		const commandName = sliced.shift();
		const args        = sliced.join(' ');
		const command     = this.commands.get(commandName);

		// Not a command
		if (!command) {
			return;
		}

		if (command.disabled) {
			return this.sendError(message, `${wrap(command.name)} has been globally disabled`);
		}

		if (message.guild && this.client.provider.get(message.guild, 'disabledCommands', {})[command.name]) {
			return this.sendError(message, `${wrap(command.name)} has been disabled in this guild`);
		}

		const isOwner = this.client.ownerIDs.includes(message.author.id);

		if (command.ownerOnly) {
			if (!isOwner) {
				return this.sendError(message, 'This command is for bot owners only');
			}
		}

		if (command.guildOnly && !message.guild) {
			return;
		}

		if (command.nsfw && message.channel.nsfw) {
			return this.sendError(message, 'This command can only be used in NSFW channels');
		}

		if (message.guild) {
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
			if (!isOwner) {
				const missingUserPerms = message.member.permissions.missing(command.userPermissions);

				if (missingUserPerms.length) {
					return message.channel.send(new MessageEmbed()
						.setColor('RED')
						.addField('You need the following permissions to execute this command', missingUserPerms)
					);
				}
			}
		}

		if (command.typing) {
			message.channel.startTyping().then(() => {
			});
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

		if (command.typing) {
			message.channel.stopTyping(true);
		}
	}
}

// Will add a separate registry later
// What did I mean by "registry"?
module.exports = ECommandHandler;
