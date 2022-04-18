import * as db from './db.js';
import { URL } from 'url';

export const init = async (client, _db) => {
	await db.init(client, _db);
	_db.on('trace', console.log);

	await client.commandHandler.registerCommands(new URL('./commands', import.meta.url).pathname, 'Subscription');
};