import * as mute from './mute/index.js';
import * as moderation from './moderation/index.js';
import * as paginatedmessage from './paginatedmessage/index.js';
import * as lockdown from './lockdown/index.js';

export const init = async (client, _db) => {
	await mute.init(client, _db);
	await moderation.init(client, _db);
	await paginatedmessage.init(client);
	await lockdown.init(client);
};

export { CircularList, PaginatedMessage } from './paginatedmessage/index.js';
