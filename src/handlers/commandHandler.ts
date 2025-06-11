import { Collection, REST, Routes } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { Command } from '../types/Command';
import { config } from '../config';

export const commands = new Collection<string, Command>();

export async function loadCommands() {
	const commandsPath = path.join(__dirname, '../commands');
	const commandsFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

	for (const file of commandsFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath).default as Command;

		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
			console.log(
				chalk.green(`Loaded command: ${command.data.name}`)
			);
		} else {
			console.log(
				chalk.red(
					`The command at ${filePath} is missing required properties.`
				)
			);
		}
	}
}

export async function registerCommands() {
	const rest = new REST({ version: '10' }).setToken(config.token);
	const commandsData = Array.from(commands.values()).map((command) =>
		command.data.toJSON()
	);

	try {
		console.log(
			chalk.blue('Started refreshing application (/) commands.')
		);

		if (config.guildId) {
			await rest.put(
				Routes.applicationGuildCommands(
					config.clientId,
					config.guildId
				),
				{ body: commandsData }
			);
			console.log(
				chalk.green(
					`Successfully registered commands in guild: (${config.guildId})`
				)
			);
		} else {
			await rest.put(Routes.applicationCommands(config.clientId), {
				body: commandsData,
			});
			console.log(
				chalk.green('Successfully registered global commands')
			);
		}
	} catch (error) {
		console.error(chalk.red(error));
		process.exit(1);
	}
}
