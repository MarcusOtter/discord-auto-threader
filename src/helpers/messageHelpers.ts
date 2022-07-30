/*
This file is part of Needle.

Needle is free software: you can redistribute it and/or modify it under the terms of the GNU
Affero General Public License as published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.

Needle is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with Needle.
If not, see <https://www.gnu.org/licenses/>.
*/

import {
	type Message,
	ButtonBuilder,
	type TextBasedChannel,
	type User,
	type Snowflake,
	ButtonStyle,
	type PublicThreadChannel,
	type InteractionResponse,
} from "discord.js";

import type { MessageContext } from "../types/messageContext";
import type { NeedleInteraction } from "../types/needleCommand";
import type { NeedleConfig } from "../types/needleConfig";
import { getConfig } from "./configHelpers";

const contexts: Map<Snowflake, MessageContext> = new Map();

export type MessageKey = keyof NonNullable<NeedleConfig["messages"]>;

export function addMessageContext(requestId: Snowflake, additionalContext: Partial<MessageContext>): void {
	const currentContext = contexts.get(requestId);
	const newContext = Object.assign(currentContext ?? {}, additionalContext);
	contexts.set(requestId, newContext);
}

export function resetMessageContext(requestSnowflake: Snowflake): void {
	contexts.delete(requestSnowflake);
}

export function isAutoThreadChannel(channelId: string, guildId: string): boolean {
	const config = getConfig(guildId);
	return config?.threadChannels?.some(x => x?.channelId === channelId) ?? false;
}

export async function getThreadAuthor(channel: PublicThreadChannel): Promise<User | undefined> {
	const parentMessage = await getThreadStartMessage(channel);

	if (parentMessage) return parentMessage.author;

	// https://github.com/MarcusOtter/discord-needle/issues/49
	const firstMessage = await getFirstMessageInChannel(channel);
	const author = firstMessage?.mentions.users.first();

	return author;
}

export async function getFirstMessageInChannel(channel: TextBasedChannel): Promise<Message | undefined> {
	const amount = channel.isThread() ? 2 : 1; // threads have an empty message as the first message
	const messages = await channel.messages.fetch({ after: "0", limit: amount });
	return messages.first();
}

export function interactionReply(
	interaction: NeedleInteraction,
	message?: string,
	ephemeral = true
): Promise<InteractionResponse> {
	if (!message || message.length === 0) {
		return interaction.reply({
			content: getMessage("ERR_UNKNOWN", interaction.id),
			ephemeral: true,
		});
	}

	return interaction.reply({
		content: message,
		ephemeral: ephemeral,
	});
}

export function getMessage(
	messageKey: MessageKey,
	requestId: Snowflake | undefined,
	replaceVariables = true
): string | undefined {
	const context = contexts.get(requestId ?? "");
	const config = getConfig(context?.interaction?.guildId ?? undefined);
	if (!config.messages) return "";

	const message = config.messages[messageKey];
	if (!context || !message) return message;

	return replaceVariables ? replaceMessageVariables(message, requestId ?? "") : message;
}

export function replaceMessageVariables(message: string, requestId: Snowflake): string {
	const context = contexts.get(requestId);
	if (!context) return message;

	const user = context.user ? `<@${context.user.id}>` : "";
	const channel = context.channel ? `<#${context.channel.id}>` : "";
	const timeAgo =
		context.timeAgo || (context.message ? `<t:${Math.round(context.message.createdTimestamp / 1000)}:R>` : "");

	return message
		.replaceAll("$USER", user)
		.replaceAll("$CHANNEL", channel)
		.replaceAll("$TIME_AGO", timeAgo)
		.replaceAll("\\n", "\n");
}

export function getDiscordInviteButton(buttonText = "Join the support server"): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(buttonText)
		.setStyle(ButtonStyle.Link)
		.setURL("https://discord.gg/8BmnndXHp6")
		.setEmoji("930584823473516564"); // :discord_light:
}

export function getGithubRepoButton(buttonText = "Source code"): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(buttonText)
		.setStyle(ButtonStyle.Link)
		.setURL("https://github.com/MarcusOtter/discord-needle/")
		.setEmoji("888980150077755412"); // :github_light:
}

export function getBugReportButton(buttonText = "Report a bug"): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(buttonText)
		.setStyle(ButtonStyle.Link)
		.setURL("https://github.com/MarcusOtter/discord-needle/issues/new/choose")
		.setEmoji("🐛");
}

export function getFeatureRequestButton(buttonText = "Suggest an improvement"): ButtonBuilder {
	return new ButtonBuilder()
		.setLabel(buttonText)
		.setStyle(ButtonStyle.Link)
		.setURL("https://github.com/MarcusOtter/discord-needle/issues/new/choose")
		.setEmoji("💡");
}

export function getHelpButton(): ButtonBuilder {
	return new ButtonBuilder()
		.setCustomId("help")
		.setLabel("Commands")
		.setStyle(ButtonStyle.Secondary)
		.setEmoji("937931337942306877"); // :slash_commands:
}

async function getThreadStartMessage(threadChannel: TextBasedChannel | null): Promise<Message | null> {
	if (!threadChannel?.isThread()) return null;

	if (!threadChannel.parentId) return null;

	const parentChannel = await threadChannel.guild?.channels.fetch(threadChannel.parentId);
	if (!parentChannel?.isTextBased()) return null;

	// The thread's channel ID is the same as the start message's ID,
	// but if the start message has been deleted this will throw an exception
	return parentChannel.messages.fetch(threadChannel.id).catch(() => null);
}
