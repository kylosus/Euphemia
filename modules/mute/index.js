import * as db from './db.js';
import * as watcher from './watcher.js';

export const init = async (client, _db) => {
	await db.init(client, _db);
	await watcher.init(client);
};

export * from './mutedRole.js';
export * from './muteHandler.js';
