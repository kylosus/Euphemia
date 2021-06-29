/*
const { Command }				= require('discord.js-commando');
const { RichEmbed }				= require('discord.js');
const config					= require('../../optional.json');
const EuphemiaPaginatedMessage	= require('../../util/EuphemiaPaginatedMessage.js');
const ebayIcon 					= 'https://cdn.discordapp.com/attachments/352865308203024395/480050217048080404/ebay.pn';

const Ebay = require('ebay-node-api');

const ebay = config.ebay_client_id ? new Ebay({
	clientID: process.env.EBAY_CLIENT_ID || config.ebay_client_id,
	limit: process.env.EBAY_SEARCH_LIMIT || config.ebay_search_limit? config.ebay_search_limit : 6
}) : null;

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: ebay ? 'ebay' : '~~ebay~~',
			group: 'utility',
			memberName: 'ebay',
			description: config.ebay_client_id? 'Searches for products on eBay' : '~~Searches for products on eBay (unavailable)~~',
			ownerOnly: !!ebay,
			hidden: !!ebay
		});
	}

	async run(message) {

		if (!ebay) {
			return;
		}

		const args = message.content.split(' ');
		if (args.length === 1) {
			return message.channel.send(new RichEmbed()
				.setTitle('Please enter search terms')
				.setColor('ORANGE')
			);
		} else {
			const a = args.splice(1).join(' ');
			const data = await ebay.findItemsByKeywords(a);

			if (!data[0].searchResult[0].item) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.addField('Error', 'Not found')
				);
			}

			EuphemiaPaginatedMessage(data[0].searchResult[0].item.map(entry =>
				new RichEmbed()
					.setColor('GREEN')
					.setAuthor(entry.title, ebayIcon, entry.viewItemURL[0])
					.setThumbnail(entry.galleryURL[0])
					.addField('Price', `${entry.sellingStatus[0].currentPrice[0].__value__} ${entry.sellingStatus[0].currentPrice[0]['@currencyId']}`, true)
					.addField('Condition', entry.condition? entry.condition[0].conditionDisplayName[0] : '-', true)
			), message);
		}
	}
};
*/

// No