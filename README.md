# I'll work on the bot when I have I'll have time
### There's a local branch with tons of additions and revisions, I promise

# Euphemia
***
![](https://files.catbox.moe/mxzpmq.jpg)

Yet another discord.js bot. And best girl.
***
#### [Click here to add Euphemia to your server](https://discordapp.com/oauth2/authorize?client_id=469059467544100864&scope=bot&permissions=2146827511)
***
### Command list
*   ##### Moderation
    * `;ban [@member] <@member2> <@member3> <...>` Bans mentioned members.
    * `;kick [@member1] <@member2> <@member3> <...>` Kicks mentioned members.
    * `;lockdown` Automatically mutes every new member. Reuse cancels the lockdown
    * `;mute <minutes> [@member1] <@member2> <@member2> <...>` Mutes mentioned users for a given amount of minutes. Mutes indefinitely, if no duration is specified.
    * `;purge <messages>` Purges a specified amount of messages. Deletes the last messages, if message amoubnt is not specified.
    * `;stop [on|off]` Denies (allows) message sending perms for @everyone in current channel.

*   ##### Server utility
    *  `;welcome` New member greeting
        *  `;welcome` Disables welcome message for current guild, if enabled.
        *  `;welcome #channel` Enables welcome message in the specified channel
        *  `;welcome { embedJSON }` Sets goodbye message to the specified JSON string. See `;help welcome` for more info.
    *  `;goodbye` Member leave message.
        *  `;goodbye` Disables goodbye message for current guild, if enabled.
        *  `;goodbye #channel` Enables goodbye message in the specified channel.
        *  `;goodbye { embedJSON }` Sets goodbye message to the specified JSON string. See `;help goodbye` for more info.
    * `;log`
        * `;log list` List all available guild events to log.
        * `;log enable logEvent #channel` Enable given log event in the specified channel.
        * `;log disable logEvent` Disable given log event.

*   ##### General utility
    * `;next <Anime title>` Returns remaining time for the next episode of given anime. Returns this day's schedule, if no anime is specified.
    * `;ping` Replies with average ping.
    * `;quote [messageID]` Quotes a message by given ID.
    * `;help <commandName>` Displays a list of available commands, or detailed information for a specified command.
    * `;stats` Displays bot stats

*   ##### Fun commands
    * `;jojo` Replies with a random JoJo/Duwang quote.
    * `;ment` Replies with a random MENT dialogue.

*   ##### Owner-only commands
    * `;groups` Lists all command groups.
    * `;enable` Enables a command or command group.
    * `;disable` Disables a command or command group.
    * `;reload` Reloads a command or command group.
    * `;load` Loads a new command
    * `;unload` Unloads a command.
    * `;prefix` Shows or sets the command prefix.
    * `;eval` Executes JavaScript code.
***
### Libraries and frameworks used
* [discord.js](https://github.com/discordjs/discord.js/) and [discord.js-commando](https://github.com/discordjs/Commando)
* [moment](https://github.com/moment/moment/) and [moment-duration-format](https://github.com/jsmreese/moment-duration-format)
* [request](https://github.com/request/request) and [request-prmise](https://github.com/request/request-promise)
*   [node-sqlite](https://github.com/kriasoft/node-sqlite/)
