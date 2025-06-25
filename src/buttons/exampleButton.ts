import { EmbedBuilder } from '@discordjs/builders';
import { Button } from '../types/Button';

const exampleButton: Button = {
	customId: 'example_button', // The customID u set when building the button in your command, etc..
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription('You have clicked me!')
					.setColor(0x0fffff)
					.setTimestamp()
					.setFooter({ text: `Run by ${interaction.user?.id}` }),
			],
			flags: 'Ephemeral',
		});
	},
};

export default exampleButton; // Exporting the button so the button handler can handle it.
