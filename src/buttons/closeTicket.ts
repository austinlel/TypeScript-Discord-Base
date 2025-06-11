import { Button } from '../types/Button';
import { Ticket } from '../schemas/ticketSchema';
import { ChannelType, EmbedBuilder } from 'discord.js';
import { createTranscript } from '../utils/Discord-Transcripts';
import { log } from 'console';

const closeTicket: Button = {
	customId: 'close_ticket',
	async execute(interaction) {
		const ticket = await Ticket.findOne({
			ticket_id: interaction.channel?.id,
		});

		if (!ticket) {
			await interaction.reply({
				flags: 'Ephemeral',
				embeds: [
					new EmbedBuilder()
						.setTitle('Error')

						.setDescription(
							'This ticket is not a valid ticket. Please delete manually.'
						)
						.setColor(0xff0000)
						.setTimestamp(),
				],
			});
		}
		if (interaction.channel) {
		} else {
			await interaction.reply({
				content:
					'Error: Unable to create transcript as the channel is null.',
				flags: 'Ephemeral',
			});
		}
		if (ticket) {
			ticket.status = 'Closed';
			await ticket?.save();

			await interaction.reply({
				embeds: [
					new EmbedBuilder().setDescription(
						`This ticket will be closed in a couple of seconds..`
					),
				],
			});
			const owner = interaction.guild?.members.cache.get(
				ticket?.owner_id
			);
			const transcript = await createTranscript(
				interaction,
				interaction.channel
			);
			try {
				await owner?.send({
					files: [transcript],
					embeds: [
						new EmbedBuilder()
							.setColor(0x000000)
							.setTitle('Ticket Closed')
							.setDescription(
								`Hello, your ticket in **${interaction.guild?.name}** has been successfully closed.\n\n` +
									`Ticket ID: (**${ticket?.ticket_id}**)\n` +
									`If you need further assistance, feel free to open a new ticket.`
							)
							.setFooter({
								text: 'Thank you for reaching out to us!',
							})
							.setTimestamp(),
					],
				});
				const log_channel = interaction.guild?.channels.cache.get(
					'1358893671109623998'
				);
				if (log_channel?.type === ChannelType.GuildText) {
					await log_channel.send({
						embeds: [
							new EmbedBuilder()
								.setTitle('Ticket Logs | Ticket Closed')
								.setDescription(
									`
								• Ticket Owner\n
								> <@${ticket.owner_id}> - ${ticket?.owner_id}\n\n
								
								• Ticket Closed By\n
								> <@${interaction.user.id}>\n
								> ${interaction.user.username} - ${interaction.user.id}\n\n
			
								• Ticket Info\n
								> 📝Ticket Name: **${
									interaction.channel && 'name' in interaction.channel
										? interaction.channel.name
										: 'Unknown'
								}**\n
								> 🔨TicketID: **${
									interaction.channel
										? interaction.channel.id
										: 'Unknown'
								}**\n
								> 📂Ticket Category: **General Support**`
								)
								.setImage(
									'https://dummyimage.com/400%20x%205/000000/fff'
								),
						],
						files: [transcript],
					});
				}
			} catch (error) {
				console.error('Error logging to channel', error);
				interaction.reply({
					content: 'Error logging to channel',
					flags: 'Ephemeral',
				});
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 3000));
			await interaction.channel?.delete('Ticket Closing');
		}
	},
};

export default closeTicket;
