import {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	MessageActionRowComponentBuilder,
} from 'discord.js';
import { Command } from '../types/Command';

const setupTickets: Command = {
	data: new SlashCommandBuilder()
		.setName('ticket_setup')
		.setDescription('Setup the ticket system'),
	async execute(interaction) {
		const ticketEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor(0x000000)
			.setAuthor({
				name: 'austin.dev | Tickets',
				iconURL: 'https://files.catbox.moe/iqhpg0.jpg',
			})
			.setThumbnail('https://files.catbox.moe/iqhpg0.jpg')
			.setTimestamp()
			.setDescription(
				'For any purchase/support inquiries please click the button below to make a ticket.'
			);

		const row: ActionRowBuilder<MessageActionRowComponentBuilder> =
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('create_ticket')
					.setLabel('Create A Ticket')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('✉️')
			);
		const channel = interaction.guild?.channels.cache.get(
			'1358606081416499240'
		);

		if (!channel || !channel.isTextBased()) {
			await interaction.reply({
				content:
					'Unable to find the specified channel or it is not text-based.',
				flags: 'Ephemeral',
			});
			return;
		}

		await channel.send({
			embeds: [ticketEmbed],
			components: [row],
		});
		await interaction.reply({
			content: `I have sent the embed successfully.`,
			flags: 'Ephemeral',
		});
	},
};

export default setupTickets;
