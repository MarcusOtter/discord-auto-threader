import type { ChatInputCommandInteraction, TextBasedChannel } from "discord.js";

export class InteractionValidator {
	public static isValidCommand(interaction: ChatInputCommandInteraction): interaction is ValidCommandInteraction {
		return !!interaction.channel;
	}
}

export interface ValidCommandInteraction extends ChatInputCommandInteraction {
	channel: TextBasedChannel;

	isChatInput(): this is ChatInputCommandInteraction;
}

// if (!InteractionValidator.isValidCommand(interaction)) return;
