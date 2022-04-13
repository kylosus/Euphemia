import { rmSync, copyFileSync, renameSync } from 'fs';
import sqlite3                              from 'sqlite3';
import * as sqlite                          from 'sqlite';

rmSync('settings_new.sqlite3', { force: true });

const dbOld = await sqlite.open({
	filename: new URL('settings.sqlite3', import.meta.url).pathname,
	driver:   sqlite3.Database
});

const dbNew = await sqlite.open({
	filename: new URL('settings_new.sqlite3', import.meta.url).pathname,
	driver:   sqlite3.Database
});

await dbNew.run('CREATE TABLE settings (guild INTEGER PRIMARY KEY, settings TEXT)');

const oldSettings = await dbOld.all('SELECT CAST(guild as TEXT) as guild, settings FROM settings');

await Promise.all(oldSettings.map(async s => {
	const newSettings = await migrate(s.guild, JSON.parse(s.settings));
	await dbNew.run('INSERT INTO settings (guild, settings) VALUES(?, ?)', s.guild, JSON.stringify(newSettings));
}));

copyFileSync('settings.sqlite3', 'settings_old.sqlite3');
rmSync('settings.sqlite3');
renameSync('settings_new.sqlite3', 'settings.sqlite3');

async function migrate(guild, oldSettings) {
	const newSettings = {};

	if (oldSettings.prefix) {
		newSettings.prefix = oldSettings.prefix;
	}

	if (oldSettings.mutedRole) {
		newSettings.mutedRole = oldSettings.mutedRole;
	}

	if (oldSettings.guildMemberAdd?.message) {
		const { content, ...embed } = JSON.parse(oldSettings.guildMemberAdd.message);
		newSettings.welcome         = {
			content,
			embed,
			channel:  oldSettings.guildMemberAdd.channel,
			automute: oldSettings.guildMemberAdd.automute ?? false,
		};
	}

	if (oldSettings.guildMemberRemove?.message) {
		const { content, ...embed } = JSON.parse(oldSettings.guildMemberRemove.message);
		newSettings.welcome         = {
			content,
			embed,
			channel: oldSettings.guildMemberRemove.channel,
		};
	}

	newSettings.log = {
		guildMemberAdd:     oldSettings?.guildMemberAdd?.log		?? null,
		guildMemberRemove:  oldSettings?.guildMemberRemove?.log		?? null,
		guildMemberMuted:   oldSettings?.guildMemberMuted?.log		?? null,
		guildMemberUnmuted: oldSettings?.guildMemberUnmuted?.log	?? null,
		guildMemberUpdate:  oldSettings?.guildMemberUpdate?.log		?? null,
		modAction:          oldSettings?.guildMemberMuted?.log		?? null,
		messageUpdate:      oldSettings?.messageUpdate?.log			?? null,
		messageDelete:      oldSettings?.messageDelete?.log			?? null,
		userUpdate:         oldSettings?.userUpdate?.log			?? null,
	};

	if (oldSettings.suggest) {
		newSettings.suggest = oldSettings.suggest;
	}

	if (oldSettings.complain) {
		newSettings.complain = oldSettings.complain;
	}

	return newSettings;
}
