import { Command } from '../types/Command';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Ticket } from '../schemas/ticketSchema';

const findTicket: Command = {
	data: new SlashCommandBuilder()
		.setName('find_ticket')
		.setDescription('Find information about a ticket by ID or owner')
		.addStringOption((option) =>
			option
				.setName('ticket_id')
				.setDescription(
					'The ticket ID you want to find. Check ticket logs if unsure.'
				)
				.setRequired(false)
		)
		.addStringOption((option) =>
			option
				.setName('user_id')
				.setDescription('The user ID of the ticket owner')
				.setRequired(false)
		),

	async execute(interaction) {
		// Get options
		const ticketId = interaction.options.getString('ticket_id');
		const userId = interaction.options.getString('user_id');

		// Check if at least one option was provided
		if (!ticketId && !userId) {
			await interaction.reply({
				content: 'Please provide either a ticket ID or a user ID.',
				ephemeral: true,
			});
			return;
		}

		// Defer reply since we'll be making database queries
		await interaction.deferReply();

		try {
			let ticket = null;

			// Search by ticket ID if provided
			if (ticketId) {
				ticket = await Ticket.findOne({ ticket_id: ticketId });

				if (!ticket) {
					await interaction.editReply({
						content: `No ticket found with ID: ${ticketId}`,
					});
					return;
				}
			}
			// Search by user ID if ticket ID not provided
			else if (userId) {
				ticket = await Ticket.findOne({ owner_id: userId });

				if (!ticket) {
					await interaction.editReply({
						content: `No tickets found for user with ID: ${userId}`,
					});
					return;
				}
			}

			// Create embed with ticket info
			const ticketEmbed = new EmbedBuilder()
				.setTitle('Ticket Information')
				.setColor(0x00ff00)
				.setDescription(
					ticketId
						? `Details for ticket ID: ${ticket?.ticket_id}`
						: `Details for the ticket owned by <@${ticket?.owner_id}>`
				)
				.addFields(
					{
						name: 'Ticket ID',
						value: ticket?.ticket_id || 'Unknown',
						inline: true,
					},
					{
						name: 'Owner',
						value: `<@${ticket?.owner_id}>` || 'Unknown',
						inline: true,
					},
					{
						name: 'Status',
						value: ticket?.status || 'Unknown',
						inline: true,
					},
					{
						name: 'Created At',
						value: ticket?.createdAt
							? new Date(ticket.createdAt).toLocaleString()
							: 'Unknown',
						inline: false,
					}
				)
				.setFooter({ text: 'Ticket Lookup System' })
				.setTimestamp();

			await interaction.editReply({ embeds: [ticketEmbed] });
		} catch (error) {
			console.error('Error looking up ticket:', error);
			await interaction.editReply({
				content:
					'An error occurred while retrieving ticket information. Please try again later.',
			});
		}
	},
};

export default findTicket;
