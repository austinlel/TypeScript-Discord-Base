import { Command } from '../types/Command';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';

const placeHolderCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('placeholder')
		.setDescription(
			'A placeholder command to demonstrate functionality.'
		),

	async execute(interaction) {
		try {
			const button = new ButtonBuilder()
				.setLabel('Click Me!')
				.setEmoji('😎')
				.setCustomId('example_button')
				.setStyle(ButtonStyle.Primary);

			const actionRow =
				new ActionRowBuilder<ButtonBuilder>().addComponents(button);

			const embed = new EmbedBuilder()
				.setColor(0x00bfff)
				.setTitle('Placeholder Command')
				.setDescription(
					'Click the button below to interact with this placeholder command.'
				)
				.setFooter({ text: 'Powered by TypeScript Discord Base' })
				.setTimestamp();

			await interaction.reply({
				embeds: [embed],
				components: [actionRow],
			});
		} catch (error) {
			console.error('Error executing placeholder command:', error);
			await interaction.reply({
				content:
					'An error occurred while executing the command. Please try again later.',
				ephemeral: true,
			});
		}
	},
};

export default placeHolderCommand;
