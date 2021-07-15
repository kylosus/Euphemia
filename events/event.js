const fs            = require('fs');
const path          = require('path');
const { Guild }     = require('discord.js');
const directoryPath = path.join(__dirname, 'loggable');


const botEventHandler    = event => require(`./bot/${event}`);
const serverEventHandler = event => require(`./loggable/${event}`);

// const botEventHandler = () => (() => {});

const _err = name => err => console.warn(`Error while executing loggable event ${name}`, err);

const registerLoggable = client => {
	const events = fs.readdirSync(directoryPath, { withFileTypes: true })
		.filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
		.map(dirent => dirent.name.replace(/\.[^/.]+$/, ''));

	const wrapper = (eventName, func) => {
		return (...args) => {
			const guild = args[0]?.guild ?? args[0];

			// I am so extremely sorry
			if (!(guild instanceof Guild)) {
				return;
			}

			const entry = client.provider.get(guild, 'log', { [eventName]: null });

			if (!entry[eventName]) {
				return;
			}

			const channel = guild.channels.cache.get(entry[eventName]);

			if (!channel || !channel.isText()) {
				// Disable the event if the channel has been deleted and/or it's not a text channel
				entry[eventName] = null;
				client.provider.set(guild, 'log', entry);
				return;
			}

			func(channel, ...args).catch(_err(eventName));
		};
	};

	events.forEach(e => {
		client.on(e, wrapper(e, serverEventHandler(e)));
	});
};

module.exports = client => {
	registerLoggable(client);		// This ignores events that start with '_'
	client.on('ready',              ()      => botEventHandler('ready')(client));
	client.on('error',                         botEventHandler('error'));
	client.on('reconnecting',                  botEventHandler('reconnecting'));
	client.on('disconnect',                    botEventHandler('disconnect'));
	client.on('guildCreate',                   botEventHandler('guildCreate'));
	client.on('guildMemberAdd',     m       => serverEventHandler('_guildMemberAdd')(m).catch(_err('guildMemberAdd')));
	client.on('guildMemberRemove',  m       => serverEventHandler('_guildMemberRemove')(m).catch(_err('guildMemberRemove')));
	client.on('userUpdate',         (o, n)  => serverEventHandler('_userUpdate')(o, n).catch(_err('userUpdate')));
};
