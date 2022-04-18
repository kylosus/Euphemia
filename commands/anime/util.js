import got from 'got';

const ANILIST_URL = 'https://graphql.anilist.co';

export const fetchAnime = (query, variables) => {
	return got.post(ANILIST_URL, {
		json:         {
			query,
			variables
		},
		responseType: 'json'
	}).json();
};
