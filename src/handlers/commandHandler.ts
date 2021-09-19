import { CommandInteraction } from "discord.js";
import { promises } from "fs";
import { resolve as pathResolve } from "path";
import { ephemeralReply } from "../helpers/messageHelpers";
import { NeedleCommand } from "../types/needleCommand";

const COMMANDS_PATH = pathResolve(__dirname, "../commands");

let loadedCommands: NeedleCommand[] = [];
export async function reloadCommands(): Promise<void> {
	console.log("Started reloading commands.");
	loadedCommands = await getAllCommands();
	console.log("Successfully reloaded commands.");
}

export function handleCommandInteraction(interaction: CommandInteraction): Promise<void> {
	const command = getCommand(interaction.commandName);
	if (!command) return Promise.reject();

	try {
		return command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return ephemeralReply(interaction, "There was an error while executing this command. Please try again later.");
	}
}

export async function getAllCommands(): Promise<NeedleCommand[]> {
	const commandFiles = await promises.readdir(COMMANDS_PATH);
	commandFiles.filter(file => file.endsWith(".js"));

	const output = [];
	for (const file of commandFiles) {
		const { command } = await import(`${COMMANDS_PATH}/${file}`);
		output.push(command);
	}

	return output;
}

export function getCommand(commandName: string): NeedleCommand | undefined {
	if (loadedCommands.length === 0) {
		console.error("No commands found. Did you forget to invoke \"reloadCommands()\"?");
	}

	return loadedCommands.find(command => command.info.name === commandName);
}
