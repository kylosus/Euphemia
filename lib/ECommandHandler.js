import { Collection, MessageEmbed } from 'discord.js';
import ECommand                     from './ECommand.js';

import { wrap } from './util/StringDoctor.js';

import { join } from 'path';
import * as fs  from 'fs';

export default class ECommandHandler {
	constructor(client, options = {
		prefix: ';',
		path:   './',
	}) {
		this.client = client;
		this.prefix = options.prefix;
		this.path   = options.path;

		this.modules  = new Collection();
		this.commands = new Collection();
	}

	async registerCommands(dir, moduleName) {
		const commands = (await Promise.all(
			fs.readdirSync(dir)
				.filter(f => f.endsWith('.js'))
				.map(async f => {
					const module = await import(join(dir, f));
					return module.default;
				})
		)).filter(_ => _);

		const parsedCommands = commands.map(module => {
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

	async loadModules(modulePath = this.path) {
		const modules = fs.readdirSync(modulePath, { withFileTypes: true })
			.filter(d => d.isDirectory());

		for (const d1 of modules) {
			await this.registerCommands(join(modulePath, d1.name), d1.name);
		}
		// .map(d => d.name);

		// modules.forEach(m => {
		// 	const path = join(modulePath, m);
		// 	this.registerCommands(path, m);
		// });
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
			message.channel.startTyping();
		}

		// Refresh cache
		if (command.fetchMembers) {
			await message.guild.members.fetch();
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
			message.channel.send({embeds: [embed]}).catch(console.warn);
		}

		if (command.typing) {
			message.channel.stopTyping(true);
		}
	}
}
