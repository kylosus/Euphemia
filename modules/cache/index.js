import * as db      from './db.js';
import * as watcher from './watcher.js';

export const init = async (client, _db) => {
	await db.init(client, _db);
	watcher.init(client, _db);
};
