import { Button } from '../types/Button';
import { Ticket } from '../schemas/ticketSchema';
import { create } from 'axios';
import {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	CategoryChannelResolvable,
	PermissionsBitField,
} from 'discord.js';

const createTicket: Button = {
	customId: 'create_ticket',
	async execute(interaction) {
		const existingTicket = await Ticket.findOne({
			owner_id: interaction.user?.id,
			status: 'Open',
		});
		if (existingTicket) {
			await interaction.reply({
				content: `You already have an open ticket: (<#${existingTicket.ticket_id})`,
				flags: 'Ephemeral',
			});
			return;
		}
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('close_ticket')
				.setLabel('Close Ticket')
				.setEmoji('🗑️')
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId('remind_user')
				.setLabel('Remind user')
				.setEmoji('⌚')
				.setStyle(ButtonStyle.Success)
		);

		const creationEmbed = new EmbedBuilder()
			.setTitle('New Ticket')
			.setColor(0x000000)
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setDescription(
				'Please provide a brief description of your inquiry.'
			)
			.setThumbnail(interaction.user?.displayAvatarURL())
			.setTimestamp();

		const ticketChannel = await interaction.guild?.channels.create({
			name: `ticket-${interaction.user?.tag}`,
			type: ChannelType.GuildText,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [
						PermissionsBitField.Flags.ViewChannel,
						PermissionsBitField.Flags.SendMessages,
					],
				},
				{
					id: interaction.user.id,
					allow: [
						PermissionsBitField.Flags.ViewChannel,
						PermissionsBitField.Flags.SendMessages,
						PermissionsBitField.Flags.ReadMessageHistory,
					],
				},
				{
					id: '1358607289233182870',
					allow: [
						PermissionsBitField.Flags.ViewChannel,
						PermissionsBitField.Flags.SendMessages,
						PermissionsBitField.Flags.ReadMessageHistory,
					],
				},
			],
			parent: interaction.guild?.channels.cache.get(
				'1358607121062559974'
			)?.id as CategoryChannelResolvable | null,
		});
		if (ticketChannel) {
			const lastTicket = await Ticket.findOne()
				.sort({ _id: -1 })
				.exec();
			const newId = lastTicket ? lastTicket._id + 1 : 1;

			await Ticket.create({
				owner_id: interaction.user.id,
				ticket_id: ticketChannel?.id,
				status: 'Open',
				createdAt: new Date(),
				_id: newId,
			});
			await ticketChannel.send({
				embeds: [creationEmbed],
				components: [row],
			});
			await interaction.reply({
				content: `I have created your ticket: ${ticketChannel?.url} `,
				flags: 'Ephemeral',
			});
			return;
		}
	},
};

export default createTicket;
