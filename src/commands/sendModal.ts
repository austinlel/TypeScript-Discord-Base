import {
	ActionRowBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { Command } from '../types/Command';

const sendModal: Command = {
	data: new SlashCommandBuilder()
		.setName('send_modal')
		.setDescription(
			'Send a modal to the user with a text input field.'
		),
	async execute(interaction) {
		const textInput = new TextInputBuilder()
			.setCustomId('example_input')
			.setLabel('How are you today?')
			.setRequired(true)
			.setMinLength(1)
			.setMaxLength(10)
			.setPlaceholder('Rate your day 1/10')
			.setStyle(TextInputStyle.Paragraph);

		const actionRow =
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				textInput
			);

		const modal = new ModalBuilder()
			.setTitle('Example Modal')
			.setCustomId('example_modal')
			.addComponents(actionRow);

		await interaction.showModal(modal);
	},
};

export default sendModal;
