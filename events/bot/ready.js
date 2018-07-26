const { RichEmbed } = require('discord.js');

module.exports = client => {
  console.log(`Logged in as ${client.user.tag}!`);

  let oldLog = console.log;
  if (!console.hijacked) {
	  console.hijacked = true;
	  let oldLog = console.log;
      console.log = message => {
		  client.owners.forEach(owner => {
			  oldLog.apply(console, [message]);
			  owner.send(new RichEmbed()
					.setColor([233, 91, 169])
					.setTitle('new console output')
				).then(() => {
					if (message > 1994) {
						message = message.substring(0, 1994);
					}
					owner.send('```' + message + '```');
				})
		  });
		}
    }
}