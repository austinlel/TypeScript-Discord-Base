import {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} from 'discord.js';
import { Button } from '../types/Button';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { verificationAttempts } from './captchaButtons';

// Generate a random captcha code
function generateCaptchaCode(length = 6) {
	let code = '';
	for (let i = 0; i < length; i++) {
		code += Math.floor(Math.random() * 10).toString();
	}
	return code;
}

async function createCaptchaImage(code: string): Promise<Buffer> {
	const canvas = createCanvas(300, 100);
	const ctx = canvas.getContext('2d');

	ctx.fillStyle = '#36393f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = '40px Comic Sans MS';
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#00ff00';

	let x = 20;
	for (let i = 0; i < code.length; i++) {
		const rotation = (Math.random() - 0.5) * 0.5;
		ctx.save();
		ctx.translate(x, 60);
		ctx.rotate(rotation);
		ctx.strokeText(code[i], 0, 0);
		ctx.restore();
		x += 40 + Math.random() * 10;
	}

	ctx.strokeStyle = '#00ff00';
	ctx.beginPath();
	ctx.moveTo(Math.random() * 100, Math.random() * 100);
	ctx.lineTo(Math.random() * 300, Math.random() * 100);
	ctx.stroke();

	return canvas.toBuffer();
}

const verify: Button = {
	customId: 'verify',

	async execute(interaction) {
		try {
			const verificationCode = generateCaptchaCode(6);

			const captchaBuffer = await createCaptchaImage(
				verificationCode
			);

			verificationAttempts.set(interaction.user.id, {
				code: verificationCode,
				attempts: 0,
				timestamp: Date.now(),
			});

			const attachment = new AttachmentBuilder(captchaBuffer, {
				name: 'captcha.png',
			});

			const numpadRows = [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('captcha_1')
						.setLabel('1')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_2')
						.setLabel('2')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_3')
						.setLabel('3')
						.setStyle(ButtonStyle.Secondary)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('captcha_4')
						.setLabel('4')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_5')
						.setLabel('5')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_6')
						.setLabel('6')
						.setStyle(ButtonStyle.Secondary)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('captcha_7')
						.setLabel('7')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_8')
						.setLabel('8')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_9')
						.setLabel('9')
						.setStyle(ButtonStyle.Secondary)
				),
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('captcha_clear')
						.setLabel('⌫')
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId('captcha_0')
						.setLabel('0')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('captcha_submit')
						.setLabel('✓')
						.setStyle(ButtonStyle.Success)
				),
			];

			const verifyEmbed = new EmbedBuilder()
				.setTitle('Are you human?')
				.setDescription(
					'To continue, you must prove you are human.\n\nEnter the green numbers from the following captcha image using the numpad below.'
				)
				.addFields({
					name: '',
					value: '• The image contains 6 green numbers',
				})
				.setImage('attachment://captcha.png')
				.setColor(0x000000);

			await interaction.reply({
				embeds: [verifyEmbed],
				components: numpadRows,
				files: [attachment],
				flags: 'Ephemeral',
			});
		} catch (error) {
			console.error('Error in verification process:', error);
			await interaction.reply({
				content:
					'An error occurred during verification. Please try again later.',
				flags: 'Ephemeral',
			});
		}
	},
};

export default verify;
