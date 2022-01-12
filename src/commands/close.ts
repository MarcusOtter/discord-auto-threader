import { SlashCommandBuilder } from "@discordjs/builders";
import { type CommandInteraction, GuildMember, MessageComponentInteraction, Permissions } from "discord.js";
import { interactionReply, getThreadStartMessage, getMessage } from "../helpers/messageHelpers";
import type { NeedleCommand } from "../types/needleCommand";

export const command: NeedleCommand = {
	name: "close",
	shortHelpDescription: "Closes a thread by setting the auto-archive duration to 1 hour",
	longHelpDescription: "The close command sets the auto-archive duration to 1 hour in a thread.\n\nWhen using auto-archive, the thread will automatically be archived when there have been no new messages in the thread for one hour. This can be undone by a server moderator by manually changing the auto-archive duration back to what it was previously, using Discord's own interface.",

	async getSlashCommandBuilder() {
		return new SlashCommandBuilder()
			.setName("close")
			.setDescription("Closes a thread by setting the auto-archive duration to 1 hour")
			.toJSON();
	},

	async execute(interaction: CommandInteraction | MessageComponentInteraction): Promise<void> {
		const member = interaction.member;
		if (!(member instanceof GuildMember)) {
			return interactionReply(interaction, getMessage("ERR_UNKNOWN"));
		}

		const channel = interaction.channel;
		if (!channel?.isThread()) {
			return interactionReply(interaction, getMessage("ERR_ONLY_IN_THREAD"));
		}

		if (channel.autoArchiveDuration === 60) {
			return interactionReply(interaction, getMessage("ERR_NO_EFFECT"));
		}

		const hasChangeTitlePermissions = member.permissionsIn(channel).has(Permissions.FLAGS.MANAGE_THREADS, true);
		if (hasChangeTitlePermissions) {
			await channel.setAutoArchiveDuration(60);
			await interactionReply(interaction, getMessage("SUCCESS_THREAD_ARCHIVE"), false);
			return;
		}

		const parentMessage = await getThreadStartMessage(channel);
		if (!parentMessage) {
			return interactionReply(interaction, getMessage("ERR_THREAD_MESSAGE_MISSING"));
		}

		if (parentMessage.author !== interaction.user) {
			return interactionReply(interaction, getMessage("ERR_ONLY_THREAD_OWNER"));
		}

		await channel.setAutoArchiveDuration(60);
		await interactionReply(interaction, getMessage("SUCCESS_THREAD_ARCHIVE"), false);
	},
};
