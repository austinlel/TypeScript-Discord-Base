import { Button } from '../types/Button';
import { Ticket } from '../schemas/ticketSchema';
import { Embed, EmbedBuilder } from 'discord.js';

const remindUser: Button = {
	customId: 'remind_user',
	async execute(interaction) {
		const ticket = await Ticket.findOne({
			ticket_id: interaction.channel?.id,
		});

		if (!ticket) {
			await interaction.reply({
				content: 'Ticket not found.',
				flags: 'Ephemeral',
			});
			return;
		}

		const ticketOwner = interaction.guild?.members.cache.get(
			ticket.owner_id as string
		)?.user;
		const ticketChannel = interaction.guild?.channels.cache.get(
			ticket.ticket_id
		);
		const reminderEmbed: EmbedBuilder = new EmbedBuilder()
			.setTitle('Ticket Reminder')
			.setDescription(
				ticketChannel
					? `This is a reminder for your ticket in ${interaction.guild?.name}.`
					: 'This is a reminder for your ticket.'
			)
			.setColor(0x000000)
			.setTimestamp()
			.setFooter({ text: 'Please address your ticket promptly.' });

		if (ticketOwner) {
			await ticketOwner.send({ embeds: [reminderEmbed] });
			await interaction.reply({
				content: 'Reminder sent successfully.',
				flags: 'Ephemeral',
			});
		} else {
			await interaction.reply({
				content: 'Could not find the ticket owner.',
				flags: 'Ephemeral',
			});
		}
	},
};

export default remindUser;
