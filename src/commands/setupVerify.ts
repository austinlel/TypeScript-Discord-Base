import { Command } from '../types/Command';
import {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ChannelType,
	ButtonStyle,
} from 'discord.js';

const setupVerify: Command = {
	data: new SlashCommandBuilder()
		.setName('verify_embed')
		.setDescription('Setup the verify embed')
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('The channel to send the verify embed to')
				.setRequired(true)
		),
	async execute(interaction) {
		if (!interaction.memberPermissions?.has('Administrator')) {
			interaction.reply({
				content:
					'You must have the permission `Administrator` to use this command.',
				flags: 'Ephemeral',
			});
			return;
		}
		const channel =
			interaction.options?.getChannel<ChannelType.GuildText>(
				'channel'
			);
		const verifyEmbed = new EmbedBuilder()
			.setTitle('Verify Your Identity')
			.setDescription(
				'Welcome! To access the server, please verify yourself by clicking the button below.'
			)
			.setColor(0x000000)
			.setImage('https://files.catbox.moe/0m857p.png')
			.setFooter({
				text: 'Verification ensures a safe and secure community.',
			});

		await channel?.send({
			embeds: [verifyEmbed],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setLabel('Verify')
						.setStyle(ButtonStyle.Primary)
						.setCustomId('verify')
						.setEmoji('✅')
				),
			],
		});
		interaction.reply({
			content: 'Verification embed sent.',
			flags: 'Ephemeral',
		});
	},
};

export default setupVerify;
