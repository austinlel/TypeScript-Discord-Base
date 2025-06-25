// Simple Modal Interface.

import { ModalSubmitInteraction } from 'discord.js';

export interface Modal {
	customId: string;
	execute: (interaction: ModalSubmitInteraction) => Promise<void>;
}
