import { Collection, inlineCode, EmbedBuilder, MessageType } from 'discord.js';
import ECommand                                              from './ECommand.js';
import { join }                                              from 'path';
import { readdirSync }                                       from 'fs';

export default class ECommandHandler {
	constructor(client, options = {
		prefix: ';',
		path:   './',
	}) {
		this.client = client;
		this.prefix = options.prefix;
		this.path   = options.path;

		this.modules       = new Collection();
		this.commands      = new Collection();
		this.slashCommands = new Collection();
	}

	async registerCommands(dir, moduleName) {
		const commands = (await Promise.all(
			readdirSync(dir)
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

		const slashCommands = parsedCommands.filter(c => c.slash).map(c => {
			const command = {
				_command:                 c,
				name:                     c.aliases[0],
				description:              c.description.content,
				defaultMemberPermissions: c.userPermissions,
			};

			command.options = [...c.args]
				.sort((a, b) => !!a.optional - !!b.optional)    // Required options need to come first
				.map(a => ({
					name:        a.id,
					type:        a.type.commandType,
					description: a.description ?? a.id,
					required:    !a.optional
				}));

			return command;
		});

		if (!slashCommands.length) {
			return;
		}

		this.client.once('ready', () => slashCommands.forEach(async c => {
			this.client.application.commands.create(c, '292277485310312448');
			this.slashCommands.set(c.name, c._command);
		}));
	}

	async loadModules(modulePath = this.path) {
		const modules = readdirSync(modulePath, { withFileTypes: true })
			.filter(d => d.isDirectory());

		for (const d1 of modules) {
			await this.registerCommands(join(modulePath, d1.name), d1.name);
		}
	}

	async sendError(message, error = this.client.config.EMOJI_NO) {
		return message.reply({
			ephemeral: true,
			embeds:    [new EmbedBuilder()
				.setColor(this.client.config.COLOR_NO)
				.setDescription(error)]
		});
	}

	async doChecks(message, command) {
		// Not a command
		if (!command) {
			throw {};
		}

		if (command.disabled) {
			throw this.sendError(message, `${inlineCode(command.name)} has been globally disabled`);
		}

		if (message.guild && this.client.provider.get(message.guild, 'disabledCommands', {})[command.name]) {
			throw this.sendError(message, `${inlineCode(command.name)} has been disabled in this guild`);
		}

		const isOwner = this.client.ownerIDs.includes(message.author.id);

		if (command.ownerOnly) {
			if (!isOwner) {
				throw this.sendError(message, 'This command is for bot owners only');
			}
		}

		if (command.guildOnly && !message.guild) {
			throw {};
		}

		if (command.nsfw && message.channel.nsfw) {
			throw this.sendError(message, 'This command can only be used in NSFW channels');
		}

		if (message.guild) {
			// Client permission check
			const missingClientPerms = message.guild.members.me.permissions.missing(command.clientPermissions);

			if (missingClientPerms.length) {
				throw message.reply({
					ephemeral: true,
					embeds:    [new EmbedBuilder()
						.setColor(this.client.config.COLOR_NO)
						.addFields({
							name:  'I need the following permissions to execute this command',
							value: missingClientPerms.join('\n')
						})]
				});
			}

			// User permission check
			// Hopefully by this point the owner is verified
			if (!isOwner) {
				const missingUserPerms = message.member.permissions.missing(command.userPermissions);

				if (missingUserPerms.length) {
					throw message.reply({
						ephemeral: true,
						embeds:    [new EmbedBuilder()
							.setColor(this.client.config.COLOR_NO)
							.addFields({
								name:  'You need the following permissions to execute this command',
								value: missingUserPerms.join('\n')
							})]
					});
				}
			}
		}

		// Refresh cache
		if (command.fetchMembers) {
			await message.guild.members.fetch();
		}
	}

	async handle(message) {
		// Message sent by a bot, ignore. Handles self as well
		if (message.author.bot) {
			return;
		}

		if (message.type !== MessageType.Default) {
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

		await this.doChecks(message, command);

		if (command.typing) {
			message.channel.sendTyping().catch(() => {});
		}

		try {
			await command.execute(message, args || '');
		} catch (err) {
			if (typeof err !== 'string') {
				console.error('An unexpected error occurred', err);
				return message.react(this.client.config.EMOJI_NO).catch(() => {
				});
			}

			const embed = command.makeError(err);
			message.reply({ embeds: [embed] }).catch(() => {});
		}
	}

	async handleSlashCommand(interaction) {
		const command = this.slashCommands.get(interaction.commandName);

		// Fix for idk
		interaction.author = interaction.user;

		// Not a command
		if (!command) {
			return;
		}

		if (command.disabled) {
			return this.sendError(interaction, `${inlineCode(command.name)} has been globally disabled`);
		}

		await this.doChecks(interaction, command);

		try {
			await command.executeSlashCommand(interaction);
		} catch (err) {
			if (typeof err !== 'string') {
				console.error('An unexpected error occurred', err);
				return;
			}

			const embed = command.makeError(err);
			// This relies on a different part of the code overwriting channel.send
			interaction.reply({ ephemeral: true, embeds: [embed] }).catch(() => {});
		}
	}
}
