# Needle
Needle is a [Discord](https://discord.com/) bot that helps you manage your [Discord threads](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ).

## Features
- Automatically create new threads for every message in certain channels
- Let thread owners close the automatically created threads with `/close`
- Let thread owners change the title of the automatically created thread with `/title`
- More to come :wink: Check out open [issues](https://github.com/MarcusOtter/discord-needle/issues)!

## Running the bot
1. Clone the repository
2. Edit the `src/config.json` with API token and the IDs of the channels you want to thread every message in:
    ```json
    {
        "discordApiToken": "INSERT TOKEN",
        "threadChannels": [
            "CHANNEL ID 1",
            "CHANNEL ID 2",
        ]
    }
    ```
3. Run `npm install`
4. Make sure the bot has the required permissions in Discord. They are:
    - `USE_PUBLIC_THREADS`
    - `SEND_MESSAGES_IN_THREADS`
    - `READ_MESSAGE_HISTORY`
5. Run `npm start`
6. Done! :tada:
