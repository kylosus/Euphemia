import * as autokick         from './autokick/index.js';
import * as lockdown         from './lockdown/index.js';
import * as mute             from './mute/index.js';
import * as moderation       from './moderation/index.js';
// import * as namefilter       from './namefilter/index.js';
import * as paginatedmessage from './paginatedmessage/index.js';
import * as subscription     from './subscription/index.js';

export const init = async (client, _db) => {
	await autokick.init(client);
	await lockdown.init(client);	// fix this
	await mute.init(client, _db);
	await moderation.init(client, _db);
	// await namefilter.init(client);
	await paginatedmessage.init(client);
	await subscription.init(client, _db);
};

export { CircularList, PaginatedMessage, SelectionPaginatedMessage } from './paginatedmessage/index.js';
