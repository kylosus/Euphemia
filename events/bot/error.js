const { RichEmbed } = require('discord.js');

module.exports = (error, client) => {
    console.log(error);
    client.owners.forEach(owner => {
        owner.send(new RichEmbed()
            .setColor('RED')
            .setTitle('An error has occured')
            .setDescription('Check console for details')
        );
    })
}
