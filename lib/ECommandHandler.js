const fs = require('fs');
const { join } = require('path');
const { Collection } = require('discord.js');

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
		this.client.on('message', m => this.handle(m));
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

			commands.forEach(({name, module}) => {
				if (!(module.prototype instanceof ECommand)) {
					console.warn(`Incompatible module found: ${name} in ${path}`);
					return;
				}

				const command = new module(this.client);
				command.module = m;

				if (!command.aliases.length) {
					this.commands.set(command.name, command);
					return;
				}

				command.aliases.forEach(a => this.commands.set(a, command));
			});
		});
	}

	async handle(message) {
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

		// Client permissions check

		// User permissions check

		// Other inhibitors

		// @everyone removal somewhere

		try {
			const parsedArgs = await command.parser.parse(message, args || '');
			const result = await command.run(message, parsedArgs);
			const reply = command.ship(message, result);
			console.log(reply);
		} catch (err) {
			const embed = command.makeError(err);
			message.channel.send(embed);
		}
	}
}

// Will add a separate registry later
module.exports = ECommandHandler;
