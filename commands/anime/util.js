const got         = require('got');
const ANILIST_URL = 'https://graphql.anilist.co';

const fetchAnime = (query, variables) => {
	return got.post(ANILIST_URL, {
		json:         {
			query,
			variables
		},
		responseType: 'json'
	}).json();
};

module.exports = {
	fetchAnime
};
