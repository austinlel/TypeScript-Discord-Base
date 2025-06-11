import { Command } from '../types/Command';
import {
	SlashCommandBuilder,
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';

const reviewCommand: Command = {
	data: new SlashCommandBuilder()
		.setName('review')
		.setDescription('Leave a review for austin.dev!'),
	async execute(interaction) {
		const reviewModal = new ModalBuilder()
			.setCustomId('reviewModal')
			.setTitle('Leave a review');

		const starsInput = new TextInputBuilder()
			.setCustomId('starsInput')
			.setPlaceholder('(1-5)')
			.setStyle(TextInputStyle.Short)
			.setValue('⭐⭐⭐⭐⭐')
			.setRequired(true)
			.setMaxLength(5)
			.setLabel('Rate our service (1-5 stars');

		const commentInput = new TextInputBuilder()
			.setCustomId('commentInput')
			.setLabel('Comment')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setPlaceholder('Your comment here...')
			.setMinLength(5);

		const productInput = new TextInputBuilder()
			.setCustomId('productInput')
			.setLabel('Product')
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setMinLength(3)
			.setPlaceholder('What product did you get?');

		reviewModal.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				starsInput
			),
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				commentInput
			),
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				productInput
			)
		);

		await interaction.showModal(reviewModal);
	},
};

export default reviewCommand;
