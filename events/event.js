import { readdirSync } from 'fs';
import { URL }         from 'url';
import { Guild }       from 'discord.js';

const directoryPath = new URL('loggable', import.meta.url);

import disconnect   from './bot/disconnect.js';
import error        from './bot/error.js';
import guildCreate  from './bot/guildCreate.js';
import ready        from './bot/ready.js';
import reconnecting from './bot/reconnecting.js';

import _guildMemberAdd    from './loggable/_guildMemberAdd.js';
import _guildMemberRemove from './loggable/_guildMemberRemove.js';
import _userUpdate        from './loggable/_userUpdate.js';

const _err = name => err => console.error(`Error while executing loggable event ${name}`, err);

const serverEventHandler = async e => (await import(`./loggable/${e}.js`)).default;

const registerLoggable = async client => {
	const events = readdirSync(directoryPath, { withFileTypes: true })
		.filter(dirent => dirent.isFile() && !dirent.name.startsWith('_'))
		.map(dirent => dirent.name.replace(/\.[^/.]+$/, ''));

	const wrapper = (eventName, func) => {
		const getGuild = (...args) => {
			if (eventName === 'messageDeleteBulk') {
				return args[0].values().next().value.guild;
			}

			return args[0]?.guild ?? args[0];
		};

		return (...args) => {
			const guild = getGuild(...args);

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

	for (const e of events) {
		client.on(e, wrapper(e, await serverEventHandler(e)));
	}
};

export const registerEvents = async client => {
	await registerLoggable(client);	// This ignores events that start with '_'
	client.on('ready',				() => ready(client));
	client.on('error',				error);
	client.on('reconnecting',		reconnecting);
	client.on('disconnect',			disconnect);
	client.on('guildCreate',		g => guildCreate(g).catch(_err('guildCreate')));
	client.on('guildMemberAdd',		m => _guildMemberAdd(m).catch(_err('guildMemberAdd')));
	client.on('guildMemberRemove',	m => _guildMemberRemove(m).catch(_err('guildMemberRemove')));
	client.on('userUpdate',			(o, n) => _userUpdate(o, n).catch(_err('userUpdate')));
};
