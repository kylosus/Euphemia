import * as watcher from './watcher.js';

export { default as CircularList }          from './CircularList.js';
export { default as CircularListGenerator } from './CircularListGenerator.js';
export * as PaginatedMessage                from './EuphemiaPaginatedMessage.js';

export const init = async (client) => {
	await watcher.init(client);
};
