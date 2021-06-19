// ok

/*
		// const args = message.content.split(' ');
		// const arg = args.slice(2).join(' ');

		if (args.split(' ')[1] === '-set') {
			// Look for id
			const match = args.match(/^\d{7,}$/);

			const role = ((match, input) => {
				if (match) {
					const role = message.guild.roles.get(match[0]);
					if (role) {
						return role;
					}
				}

				// Look for role name
				const inputLow = input.toLowerCase();
				return message.guild.roles.find(role => role.name.toLowerCase().includes(inputLow)) || null;
			})(match, args);

			if (!role) {
				return message.embed(new RichEmbed()
					.setColor('RED')
					.setTitle('Role not found')
				);
			}

			if (role.position >= message.guild.me.highestRole.position) {
				return message.channel.send(new RichEmbed()
					.setColor('RED')
					.setTitle('Role cannot be assigned as the mute role because it is higher than, or equal to the bot in the role hierarchy.')
				);
			}

			message.guild.settings.set('mutedRole', role.id);

			return message.channel.send(new RichEmbed()
				.setColor('GREEN')
				.setTitle(`Mute role set to ${role.name}.`)
			);
		}
 */