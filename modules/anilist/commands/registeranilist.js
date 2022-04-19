import { ArgConsts, ECommand } from '../../../lib/index.js';
import got                     from 'got';
import { insertAnilist }       from '../db.js';

const ANILIST_URL = 'https://graphql.anilist.co';

const fetch = ({ query, variables }) => {
	return got.post(ANILIST_URL, {
		json:         {
			query,
			variables
		},
		responseType: 'json'
	}).json();
};

export default class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['registeranilist'],
			description: {
				content:  'Registers AniList username',
				usage:    '<username>',
				examples: ['registeranilist Amvi']
			},
			args:        [
				{
					id:       'username',
					type:     ArgConsts.TYPE.WORD,
					messages: 'Please enter your AniList username'
				}
			],
			guildOnly:   true,
			ownerOnly:   false,
		});
	}

	async run(message, { username }) {
		const query = `
			query($username: String) {
				User(name: $username) {
					id
					name
				}
			}
		`;

		const variables = { username };

		let user = null;

		try {
			const result = await fetch({ query, variables });
			user         = result.data.User;
		} catch (err) {
			if (err.response.statusCode === 404) {
				throw 'Username not found';
			}

			throw err;
		}

		await insertAnilist({
			user:            message.author,
			anilistID:       user.id,
			anilistUsername: user.name
		});

		return 'Registered username';
	}
}
