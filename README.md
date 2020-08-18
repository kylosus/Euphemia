# I'll work on the bot when I have I'll have time
### Check the dev branch in the meantime
### There's a local branch with tons of additions and revisions, I promise

# Ray Bot
***
![](https://cdn.discordapp.com/attachments/740518490003341314/744852639963152435/IMG_20200817_150803.jpg)

Yet another discord.js bot. And best Boy.
***
#### [Click here to add Ray Bot to your server](https://discordapp.com/oauth2/authorize?client_id=733873434458849411&scope=bot&permissions=2146827511)
***
### Command list
*   ##### Moderation
    * `Rban [@member] <@member2> <@member3> <...>` Bans mentioned members.
    * `Rkick [@member1] <@member2> <@member3> <...>` Kicks mentioned members.
    * `Rlockdown` Automatically mutes every new member. Reuse cancels the lockdown
    * `Rmute <minutes> [@member1] <@member2> <@member2> <...>` Mutes mentioned users for a given amount of minutes. Mutes indefinitely, if no duration is specified.
    * `Rpurge <messages>` Purges a specified amount of messages. Deletes the last messages, if message amoubnt is not specified.
    * `Rstop [on|off]` Denies (allows) message sending perms for @everyone in current channel.

*   ##### Server utility
    *  `Rwelcome` New member greeting
        *  `Rwelcome` Disables welcome message for current guild, if enabled.
        *  `Rwelcome #channel` Enables welcome message in the specified channel
        *  `Rwelcome { embedJSON }` Sets goodbye message to the specified JSON string. See `;help welcome` for more info.
    *  `Rgoodbye` Member leave message.
        *  `Rgoodbye` Disables goodbye message for current guild, if enabled.
        *  `Rgoodbye #channel` Enables goodbye message in the specified channel.
        *  `Rgoodbye { embedJSON }` Sets goodbye message to the specified JSON string. See `;help goodbye` for more info.
    * `Rlog`
        * `Rlog list` List all available guild events to log.
        * `Rlog enable logEvent #channel` Enable given log event in the specified channel.
        * `Rlog disable logEvent` Disable given log event.

*   ##### General utility
    * `Rnext <Anime title>` Returns remaining time for the next episode of given anime. Returns this day's schedule, if no anime is specified.
    * `Rping` Replies with average ping.
    * `Rquote [messageID]` Quotes a message by given ID.
    * `Rhelp <commandName>` Displays a list of available commands, or detailed information for a specified command.
    * `Rstats` Displays bot stats

*   ##### Fun commands
    * `Rjojo` Replies with a random JoJo/Duwang quote.
    * `Rment` Replies with a random MENT dialogue.

*   ##### Owner-only commands
    * `Rgroups` Lists all command groups.
    * `Renable` Enables a command or command group.
    * `Rdisable` Disables a command or command group.
    * `Rreload` Reloads a command or command group.
    * `Rload` Loads a new command
    * `Runload` Unloads a command.
    * `Rprefix` Shows or sets the command prefix.
    * `Reval` Executes JavaScript code.
***
### Libraries and frameworks used
* [discord.js](https://github.com/discordjs/discord.js/) and [discord.js-commando](https://github.com/discordjs/Commando)
* [moment](https://github.com/moment/moment/) and [moment-duration-format](https://github.com/jsmreese/moment-duration-format)
* [request](https://github.com/request/request) and [request-prmise](https://github.com/request/request-promise)
*   [node-sqlite](https://github.com/kriasoft/node-sqlite/)
