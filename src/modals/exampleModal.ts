import { Modal } from '../types/Modal';
import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';

const reviewModal: Modal = {
	customId: 'example_modal',
	async execute(interaction: ModalSubmitInteraction) {
		try {
			const userInput =
				interaction.fields?.getTextInputValue('example_input');

			const embed = new EmbedBuilder()
				.setTitle('Modal Submission Received')
				.setDescription(`You have replied: **${userInput}**`)
				.setColor(0x00ff00)
				.setTimestamp();

			await interaction.reply({
				embeds: [embed],
			});
		} catch (error) {
			console.error('Error handling modal submission:', error);

			const errorEmbed = new EmbedBuilder()
				.setTitle('Error')
				.setDescription(
					'An error occurred while processing your input.'
				)
				.setColor(0xff0000)
				.setTimestamp();

			await interaction.reply({
				embeds: [errorEmbed],
				ephemeral: true,
			});
		}
	},
};

export default reviewModal;
