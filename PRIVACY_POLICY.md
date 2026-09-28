# Lancelot Albion Privacy Policy
**Effective for:** `Lancelot Albion#0230` (ID `420250496419364868`)
**Last updated:** 2026-09-28

Lancelot Albion ("the bot") is a self-hosted Discord moderation bot operated by `@jokersus` (ID `275331662865367040`) ("we"). This policy explains what data the bot processes in servers where it is installed. Discord's own [Privacy Policy](https://discord.com/privacy) also applies to your use of Discord.

## 1. Data we process

The bot collects and processes the following user and server data:

| Data                                        | Source                 | Purpose                                                                                                              | Stored?                                |
| ------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| User ID, username, avatar, roles, join time | Server Members intent  | Welcome/goodbye messages, auto-assigned roles, raid lockdown and range bans, notices when elevated roles are granted | In memory only, except as listed in §2 |
| Message text, attachments, embeds           | Message Content intent | Commands, XP eligibility (length/attachment check), keyword-triggered notices, edit/delete logs                      | In memory only; see §3                 |
| Messages sent to the bot by DM              | Direct message         | Forwarded to the operator for support                                                                                | Kept in the operator's Discord DMs     |

## 2. Data stored persistently

The bot stores only the following in its persistent database:

- **Server configuration:** channel/role IDs, welcome/goodbye templates, triggers, and other settings set by server staff.
- **XP:** user ID, server ID, XP total, earned reward roles, and the username and avatar ID shown on leaderboards.
- **Moderation records:** warnings, mutes, bans and other actions (target user ID, moderator ID, reason, timestamp, and expiry).
- **Feature data you create yourself** (e.g. reminders, quotes, tags), if those features are enabled.

The bot does **not** store message content in its database.

## 3. Message content

Message content is read in memory and discarded after processing. For edit/delete logging, recent messages are held in an in-memory cache of at most **200 messages per channel**. The cache is cleared when the bot restarts once a day.

When a message is edited or deleted in a channel with logging enabled, the bot posts its content to a staff-only log channel **on Discord**. Those log messages are controlled by the server's staff and remain until they delete them.

## 4. How we use data

Data is used only to provide the features above. We do not sell, rent, or license data. We do not use it for advertising, profiling, or tracking across servers. We do not use it to train machine-learning or AI models.

## 5. Sharing

We do not share data with third parties, except:
- with our hosting provider, [DigitalOcean, USA](https://www.digitalocean.com/), used solely to run the bot.
- where required by law.

## 6. Retention and deletion

All data is stored on encrypted storage. Access to data is limited to the operator.

The retention policy is:
- **Server data** is deleted within 30 days after the bot is removed from the server.
- **Your data** (XP, moderation records, and any feature data) is deleted within 30 days of your request.
- **All data** is deleted if the bot is discontinued.

To request access, correction, or deletion, contact us via `@jokersus` on Discord or email `jokersus.cava [at] gmail.com`.

## 7. Changes

We may update this policy. Changes are published here with a new "Last updated" date.

## 8. Contact

Contact the bot operator:
- On discord at `@jokersus`
- Email `jokersus.cava [at] gmail.com`.
