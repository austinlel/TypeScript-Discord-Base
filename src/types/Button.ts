// Simple Button Interface..

import { ButtonInteraction } from 'discord.js';

export interface Button {
	customId: string;
	execute: (interaction: ButtonInteraction) => Promise<void>;
}
