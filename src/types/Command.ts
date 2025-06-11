import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface Command {
	data:
		| SlashCommandBuilder
		| Omit<
				SlashCommandBuilder,
				'addSubcommand' | 'addSubcommandGroup'
		  >
		| SlashCommandOptionsOnlyBuilder
		| SlashCommandSubcommandsOnlyBuilder;
	execute: (
		interaction: ChatInputCommandInteraction
	) => Promise<void>;
}
