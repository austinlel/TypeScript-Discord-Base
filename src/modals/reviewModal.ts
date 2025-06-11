import { Modal } from '../types/Modal';
import { Reviews } from '../schemas/reviewSchema';
import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import mongoose from 'mongoose';

const reviewModal: Modal = {
	customId: 'reviewModal',
	async execute(interaction: ModalSubmitInteraction) {
		await interaction.deferReply({
			flags: 'Ephemeral',
		});
		if (interaction.channel?.id !== '1358215897298505968') {
			await interaction.editReply({
				content: `You are not allowed to run this command in this current channel. Please go to: https://discord.com/channels/1358214102035730592/1358215897298505968`,
			});
			return;
		}
		const stars = interaction.fields?.getTextInputValue('starsInput');
		const comment =
			interaction.fields?.getTextInputValue('commentInput');
		const product =
			interaction.fields?.getTextInputValue('productInput');

		const reviewCount = await Reviews.countDocuments();
		const reviewEmbed = new EmbedBuilder()
			.setColor(0xffffff)
			.setAuthor({
				name: `Review #${reviewCount + 1}`,
				iconURL: interaction.user?.avatarURL() || '',
			})
			.setTitle('New Product Review')
			.setDescription('A new review has been submitted!')
			.setThumbnail(interaction.user?.avatarURL.toString())
			.addFields(
				{ name: 'Rating', value: stars || 'N/A', inline: true },
				{
					name: '📝 Comment',
					value: comment || 'N/A',
					inline: false,
				},
				{ name: '📦 Product', value: product || 'N/A', inline: true }
			)
			.setFooter({
				text: `Reviewed by ${interaction.user?.tag}`,
				iconURL: interaction.user?.avatarURL() || '',
			})
			.setTimestamp();

		await Reviews.create({
			user_id: interaction.user?.id,
			comment: comment || '',
			stars: stars || '',
			reviewedAt: interaction.createdAt?.toISOString() || null,
			product: product || '',
			_id: new mongoose.Types.ObjectId(),
		});

		const reviewChannel = interaction.guild?.channels.cache.get(
			'1358215897298505968'
		);

		if (!reviewChannel || !reviewChannel.isTextBased()) {
			await interaction.editReply({
				content:
					'Unable to find the specified channel or it is not text-based.',
			});
			return;
		}

		await reviewChannel.send({
			embeds: [reviewEmbed],
		});

		await interaction.editReply(
			'Your review has been submitted successfully!'
		);
	},
};

export default reviewModal;
