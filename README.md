

<div align="center">
   <h1>
      Needle
      <sub>
         <a href="#"><img src="https://raw.githubusercontent.com/MarcusOtter/discord-needle/main/branding/logo-64x64.png" height="39" width="39"></a>
      </sub>
   </h1>
   Needle is a <b><a href="https://discord.com/">Discord</a> bot</b> that helps you declutter your server by creating <a href="https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ">Discord threads</a> automatically
   <br/><br/>
   <a href="https://needle.gg">Website ✨</a> &emsp; <a href="https://needle.gg/invite">Invite Needle 🪡</a> &emsp; <a href="https://needle.gg/chat">Get support 💬</a>
</div>

## Self-hosting
This step-by-step guide assumes you have [NodeJS](https://nodejs.org/en/) version `16.9.0` or higher installed and that you have a Discord Bot user set up at [Discord's developer page](https://discord.com/developers/applications) that has been invited to your server with the scopes `applications.commands` and `bot`.

1. Fork and clone the repository
2. Create a file named `.env`  in the root directory and insert your bot's Discord API token and Application ID:
   ```bash
   DISCORD_API_TOKEN=abcd1234...
   CLIENT_ID=123456...
   ```
3. Run `npm install`
4. Run `npm deploy`. This will make the slash commands show up in the servers the bot are in, but **it can take up to _ONE HOUR_ before they show up**.
5. Make sure the bot has the required permissions in Discord:
   - [x] View channels
   - [x] Send messages
   - [x] Send messages in threads
   - [x] Create public threads
   - [x] Read message history
6. Run `npm start`
7. Deploy! :tada:

## Contributing
Coming soon :tm:

[Join the Discord](https://needle.gg/chat) if interested!
