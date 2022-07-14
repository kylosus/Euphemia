# Euphemia
***
Yet another discord.js bot.
***
#### Run `npm install --build-from-source` on project root to install, and `npm run` to start.
Minimal bot configuration is in `config.json`. You can alternatively use a `.env` file.

You need CUDA 11.6 with cuDNN 8.1+ with an MPI compatible compiler. Only devices with compute capability 7.0+ connected through NVLINK are supported. Make sure `CUDA_HOME`, `MPI_HOME` and (optionally) `NVSHMEM_HOME` environment variables are set.
***
### Command list
*   ##### Anime
    * `;anime [anime title]` Searches for anime on AniList
    * `;next [anime title]` Returns remaining time for the next episode of given anime

*   ##### Bot
    * `;help [command/module]` Lists available commands.
    * `;ping ` Replies with ping
    * `;stats ` Shows bot stats

*   ##### Fun
    * `;jojo ` Replies with a random JoJo quote
    * `;ment ` Replies with a random Code Ment quote

*   ##### Moderation
    * `;ban <user> [user2...] [reason]` Bans a user.
    * `;banprune <user> [reason]` Re-bans a user to prune their messages. Use during raids
    * `;banrange [user2...] [reason]` Bans every user joined within a range. Useful for mass bot joins
    * `;kick <member> [member2...] [reason]` Kicks a member.
    * `;lockdown ` Automatically mutes every new member on join.
    * `;mute [minutes] <member1> [member2 ...]` Mutes mentioned members for a given amount of time
    * `;muteset [role]` Sets muted role for the server
    * `;nopics [#channel]` Denies Attach Files and Embed Links permissions for @everyone in specified channels.
    * `;prunerole <role>` Removes all members in a role
    * `;pruneroles <role>` Removes all members in a role
    * `;purge [amount]` Purges messages in the channel.
    * `;reping <role> [message]` (Re-)Pings a role and gives people an option to join and leave
    * `;silentwarn <member> [member2...] <reason>` Warns a member without sending a DM.
    * `;spank <member1> [member2 ...]` Spanks bad people
    * `;stop [#channel]` Denies Send Message permissions for @everyone in specified channels.
    * `;timeout [minutes] <member1> [member2 ...]` Times out mentioned members for a given amount of time
    * `;unmute <member1> [member2 ...]` Unmutes mentioned users
    * `;warn <member> [member2...] <reason>` Warns a member.

*   ##### Owner
    * `;cache cache [channel]` Caches messages in a channel
    * `;die [exit code]` Kills the bot
    * `;disableg <command name>` Disables a command globally
    * `;dm <user> [user2...] <text>` DMs users. Supports embeds
    * `;enableg <command name>` Enables a command globally
    * `;eval <code>` Evaluates JavaScript code
    * `;restart ` Restarts the bot. Be careful when using with pm2 and other managers
    * `;update ` Updates the bot and restarts

*   ##### Server
    * `;disable <command name>` Disables a command in the server
    * `;edit <message url or reply> <text>` Edits messages. Supports embeds
    * `;enable <command name>` Enables a command in the server
    * `;getembed [channel or current channel] <text>` Says something. Supports embeds
    * `;healthcheck ` Server health check
    * `;say [channel or current channel] <text>` Says something. Supports embeds

*   ##### Setup
    * `;goodbye channel {Embed JSON}` Sets up goodbye channel and message. Send without arguments to disable it
    * `;log ` Handles loggable server events
    * `;logdisable [channel (or current channel)] [event name]` Disables log events in channels. Run without the second argument to disable everything
    * `;logenable [channel (or current channel)] [event name]` Enables log events in channels. Run without the second argument to enable everything
    * `;setup ` Sets up guild settings
    * `;welcome channel {Embed JSON}` Sets up welcome channel and message. Send without arguments to disable it

*   ##### Utility
    * `;avatar [user]` Shows avatar of a given user
    * `;banner [user]` Shows banner of a given user
    * `;inrole [user]` Shows members in a given role
    * `;quote <id> [#channel]` Quotes a message
    * `;urban [prompt]` Looks up Urban Dictionary definitions
    * `;color <color>` Shows color

*   ##### Modlog
    * `;action <action number>` Shows details of a specified action
    * `;actions [from @moderator] [to @member]` Lists moderation actions in the server
    * `;importcarl <carl exported message id>` Imports carl database
    * `;reason <action number>` Changes reason for an action

*   ##### Subscription
    * `;intag <name>` Shows all users in the tag without pinging
    * `;subscribe <name>` Subscribes to a tag
    * `;tag <name>` Pings a tag
    * `;tagadd <name>` Adds a new tag
    * `;tagremove <name>` Adds a new tag
    * `;tags ` Lists all tags in the server
    * `;unsubscribe <name>` Unsubscribes from a tag

***
