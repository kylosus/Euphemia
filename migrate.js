const fs      = require('fs');
const path    = require('path');
const sqlite3 = require('sqlite3').verbose();
const sqlite  = require('sqlite');

fs.rmSync('settings_new.sqlite3', { force: true });

sqlite.open({
	filename: path.join(__dirname, 'settings.sqlite3'),
	driver:   sqlite3.Database
}).then(dbOld => {
	sqlite.open({
		filename: path.join(__dirname, 'settings_new.sqlite3'),
		driver:   sqlite3.Database
	}).then(async dbNew => {
		await dbNew.run('CREATE TABLE settings (guild INTEGER PRIMARY KEY, settings TEXT)');

		const oldSettings = await dbOld.all('SELECT CAST(guild as TEXT) as guild, settings FROM settings');
		await Promise.all(oldSettings.map(async s => {
			const newSettings = await migrate(s.guild, JSON.parse(s.settings));
			await dbNew.run('INSERT INTO settings (guild, settings) VALUES(?, ?)', s.guild, JSON.stringify(newSettings));
		}));

		fs.copyFileSync('settings.sqlite3', 'settings_old.sqlite3');
		fs.rmSync('settings.sqlite3');
		fs.renameSync('settings_new.sqlite3', 'settings.sqlite3');
	});
});

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
		guildMemberAdd:		oldSettings?.guildMemberAdd?.log		?? null,
		guildMemberRemove:	oldSettings?.guildMemberRemove?.log		?? null,
		guildMemberMuted:	oldSettings?.guildMemberMuted?.log		?? null,
		guildMemberUnmuted:	oldSettings?.guildMemberUnmuted?.log	?? null,
		guildMemberUpdate:	oldSettings?.guildMemberUpdate?.log		?? null,
		modAction:			oldSettings?.guildMemberMuted?.log		?? null,
		messageUpdate:		oldSettings?.messageUpdate?.log			?? null,
		messageDelete:		oldSettings?.messageDelete?.log			?? null,
		userUpdate:			oldSettings?.userUpdate?.log			?? null,
	};

	if (oldSettings.suggest) {
		newSettings.suggest = oldSettings.suggest;
	}

	if (oldSettings.complain) {
		newSettings.complain = oldSettings.complain;
	}

	return newSettings;
}
