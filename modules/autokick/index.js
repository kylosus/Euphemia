import * as watcher from './watcher.js';
import { URL }      from 'url';

export const init = async client => {
	watcher.init(client);
	await client.commandHandler.registerCommands(new URL('./commands', import.meta.url).pathname, 'AutoKick');
};

export const getState   = guild => guild.autokick;
export const setState   = (guild, state) => guild.autokick = state;
export const setGuild   = guild => guild.autokick = true;
export const unsetGuild = guild => delete guild.autokick;
