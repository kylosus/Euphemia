const config = require('../config.json');
const { RichEmbed } = require('discord.js');

exports.build = input => {
        return false;
    } else {
        const embed = new RichEmbed().setColor(config.defaultColor);
        const json = typeof input === 'string'? JSON.parse(input) : typeof input === 'object'? input : null;
        embed.content = null;
	if (!_validate(input)) {

        if (json.hasOwnProperty('author')) {
            if (typeof json.author === 'string') {
                embed.setAuthor(json.author || 'invalid-author');
            } else if (validate(JSON.stringify(json.author))) {
                embed.setAuthor(json.author.name || 'invalid-author', json.author.icon_url || null, json.author.url || null);
            }
        }
        if (json.hasOwnProperty('color')) {
            if (typeof json.color !== 'object') {
                embed.setColor(json.color);
            }
        }
        if (json.hasOwnProperty('description')) {
            if (typeof json.description === 'string') {
                embed.setDescription(json.description || '-');
            }
        }
        if (json.hasOwnProperty('fields')) {
            if (Array.isArray(json.fields)) {
                json.fields.forEach(field => {
                    embed.addField(field.name || '-', field.value || '-', field.inline || null);
                });
            }
        }
        if (json.hasOwnProperty('footer')) {
            if (typeof json.footer === 'string') {
                embed.setFooter(json.footer);
            }
        }
        if (json.hasOwnProperty('image')) {
            if (typeof json.image === 'string') {
                embed.setImage(json.image);
            }
        }
        if (json.hasOwnProperty('thumbnail')) {
            if (typeof json.thumbnail === 'string') {
                embed.setThumbnail(json.thumbnail);
            }
        }
        if (json.hasOwnProperty('title')) {
            if (typeof json.title === 'string') {
                embed.setTitle(json.title);
            }
        }
        if (json.hasOwnProperty('url')) {
            if (typeof json.title === 'string') {
                embed.setTitle(json.title);
            }
        }
        if (json.hasOwnProperty('content')) {
            if (typeof json.content === 'string') {
                embed.content = json.content;
            }
        }
        return embed;
    }
},

exports.validate = _validate;

    return string && /^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
}function _validate(string) {
