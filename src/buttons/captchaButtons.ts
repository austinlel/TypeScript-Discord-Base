import {
	ButtonInteraction,
	GuildMember,
	EmbedBuilder,
} from 'discord.js';

const userInputs = new Map<string, string>();
const verificationAttempts = new Map();

export { verificationAttempts };

export const handleCaptchaClick = async (
	interaction: ButtonInteraction,
	buttonValue: string
) => {
	const userId = interaction.user.id;
	let currentInput = userInputs.get(userId) || '';

	switch (buttonValue) {
		case 'clear':
			currentInput = '';
			break;
		case 'submit':
			const verificationData = verificationAttempts.get(userId);
			if (!verificationData) {
				await interaction.update({
					content: 'Verification session expired. Please try again.',
					embeds: [],
					components: [],
				});
				return;
			}

			if (currentInput === verificationData.code) {
				try {
					const member = interaction.member as GuildMember;

					const verifiedRoleId =
						process.env.VERIFIED_ROLE_ID || '1358216258247463102';

					await member.roles.add(verifiedRoleId);

					const successEmbed = new EmbedBuilder()
						.setTitle('Verification Successful')
						.setDescription(
							'You have been successfully verified. Welcome to the server!'
						)
						.setColor(0x00ff00);

					await interaction.update({
						content: '',
						embeds: [successEmbed],
						components: [],
						files: [],
					});

					verificationAttempts.delete(userId);
					userInputs.delete(userId);
				} catch (error) {
					console.error('Error assigning verified role:', error);
					await interaction.update({
						content:
							'Verification successful, but there was an error assigning your role. Please contact an administrator.',
						embeds: [],
						components: [],
						files: [],
					});
				}
			} else {
				verificationData.attempts += 1;

				if (verificationData.attempts >= 3) {
					verificationAttempts.delete(userId);
					userInputs.delete(userId);

					await interaction.update({
						content:
							'Too many failed attempts. Please try again later.',
						embeds: [],
						components: [],
						files: [],
					});
					return;
				}

				const failureEmbed = new EmbedBuilder()
					.setTitle('Verification Failed')
					.setDescription(
						`Incorrect code. Please try again. (Attempt ${verificationData.attempts}/3)`
					)
					.setColor(0xff0000);

				await interaction.update({
					embeds: [failureEmbed, interaction.message.embeds[0]],
					components: interaction.message.components,
					files: interaction.message.attachments.map(
						(attachment) => attachment.url
					),
				});

				currentInput = '';
			}
			break;
		default:
			if (currentInput.length < 6) {
				currentInput += buttonValue;
			}
			break;
	}

	userInputs.set(userId, currentInput);

	if (buttonValue !== 'submit') {
		const inputDisplay = currentInput.padEnd(6, '_');

		const updatedEmbed = EmbedBuilder.from(
			interaction.message.embeds[0]
		).setDescription(
			`To continue, you must prove you are human.\n\nEnter the green numbers from the following captcha image using the numpad below.\n\nYour input: \`${inputDisplay}\``
		);

		await interaction.update({
			embeds: [updatedEmbed],
			components: interaction.message.components,
			files: interaction.message.attachments.map(
				(attachment) => attachment.url
			),
		});
	}
};
