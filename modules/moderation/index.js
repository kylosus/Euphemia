import { URL } from 'url';
import * as db from './db.js';

export const init = async (client, _db) => {
	await db.init(client, _db);
	await client.commandHandler.registerCommands(new URL('./commands', import.meta.url).pathname, 'Modlog');
};

export { default as ModerationCommand }       from './ModerationCommand.js';
export { default as ModerationCommandResult } from './ModerationCommandResult.js';
