import cron                                                                                     from 'node-cron';
import {
	deregisterMember, insertGuild, insertUser, registerAllGuilds, registerEntireGuild, registerMember
} from './db.js';

// Sync all guilds when ready
const ready = async client => {
	return registerAllGuilds({ client });
};

const userUpdate = async (oldUser, newUser) => {
	if (oldUser.tag !== newUser.tag) {
		return;
	}

	await insertUser({ user: newUser });
};

const guildUpdate = async (oldGuild, newGuild) => {
	if (oldGuild.name !== newGuild.name) {
		return;
	}

	await insertGuild({ guild: newGuild });
};

const guildCreate = async guild => {
	return registerEntireGuild({ guild });
};

const guildMemberAdd = async member => {
	return registerMember({ member });
};

const guildMemberRemove = async member => {
	return deregisterMember({ member });
};

const watch = client => {
	client.once('ready', () => {
		ready(client)
			.catch(console.error)
			.then(() => {
				// At 00:00 on Sunday
				cron.schedule('0 0 * * 0', () => {
					ready(client).catch(console.error);
				}, null);
			});
	});

	client.on('userUpdate',        (...args) => userUpdate(...args).catch(console.error));
	client.on('guildUPdate',       (...args) => guildUpdate(...args).catch(console.error));
	client.on('guildCreate',       (...args) => guildCreate(...args).catch(console.error));
	client.on('guildMemberAdd',    (...args) => guildMemberAdd(...args).catch(console.error));
	client.on('guildMemberRemove', (...args) => guildMemberRemove(...args).catch(console.error));
};

export const init = client => {
	watch(client);
};
