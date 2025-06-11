import {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
} from 'discord.js';
import { commands } from './commandHandler';
import * as mongoose from 'mongoose';
import { buttons } from './buttonHandler';
import chalk from 'chalk';
import { modals } from './modalHandler';

function displayAsciiArt() {
	console.clear();
	console.log(
		chalk.cyan(`
██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗     ██████╗  ██████╗ ████████╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔═══██╗╚══██╔══╝
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║    ██████╔╝██║   ██║   ██║   
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║    ██╔══██╗██║   ██║   ██║   
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝    ██████╔╝╚██████╔╝   ██║   
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     ╚═════╝  ╚═════╝    ╚═╝   
	`)
	);
	console.log(chalk.magenta('═'.repeat(80)));
	console.log(
		chalk.yellow(
			'                          Austin Development Discord Bot'
		)
	);
	console.log(chalk.magenta('═'.repeat(80)));
	console.log();
}

export async function setupClient() {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
		],
	});

	client.once(Events.ClientReady, () => {
		initializeClient(client);
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		await handleInteraction(interaction);
	});

	return client;
}

async function initializeClient(client: Client) {
	displayAsciiArt();

	client.user?.setActivity({
		name: `Austin Develop`,
		type: ActivityType.Watching,
	});
	client.user?.setPresence({ status: 'dnd' });

	console.log(
		chalk.green('🤖 ') +
			chalk.white(`Bot User: ${chalk.cyan(client.user?.tag)}`)
	);
	console.log(
		chalk.green('✅ ') +
			chalk.white('Client Status: ') +
			chalk.green('OPERATIONAL')
	);
	console.log();

	if (process.env?.USE_DATABASE !== 'true') {
		console.log(
			chalk.yellow('⚠️  ') +
				chalk.white('Database: ') +
				chalk.red('DISABLED')
		);
		console.log(
			chalk.gray(
				'   └─ Set USE_DATABASE=true to enable MongoDB connection'
			)
		);
		return;
	} else {
		const mongooseUrl = process.env?.MONGOOSE_URL;
		if (typeof mongooseUrl !== 'string') {
			throw new Error(
				'MONGOOSE_URL is not defined in the environment variables & or is not a string.'
			);
		}

		console.log(
			chalk.blue('🔗 ') + chalk.white('Connecting to MongoDB...')
		);
		await mongoose.connect(mongooseUrl);
		console.log(
			chalk.green('✅ ') +
				chalk.white('Database: ') +
				chalk.green('CONNECTED')
		);
	}

	console.log();
	console.log(chalk.magenta('═'.repeat(80)));
	console.log(
		chalk.cyan('                              Bot is now running!')
	);
	console.log(chalk.magenta('═'.repeat(80)));
	console.log();
}

async function handleInteraction(interaction: any) {
	try {
		if (interaction.isChatInputCommand()) {
			await handleCommandInteraction(interaction);
		} else if (interaction.isButton()) {
			await handleButtonInteraction(interaction);
		} else if (interaction.isModalSubmit()) {
			await handleModalInteraction(interaction);
		}
	} catch (error) {
		console.error(chalk.red('❌ ERROR: ') + error);
		await handleInteractionError(interaction);
	}
}

async function handleCommandInteraction(interaction: any) {
	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(
			chalk.red('❌ COMMAND ERROR: ') +
				chalk.white(
					`No command matching ${chalk.yellow(
						interaction.commandName
					)} was found.`
				)
		);
		return;
	}

	await command.execute(interaction);
	if (process.env?.DEBUG_MODE !== 'production') {
		console.log(
			chalk.green('⚡ COMMAND: ') +
				chalk.cyan(interaction.commandName) +
				chalk.gray(` executed by ${interaction.user.tag}`)
		);
	}
	return;
}

async function handleButtonInteraction(interaction: any) {
	const button = buttons.get(interaction.customId);

	if (!button) {
		console.error(
			chalk.red('❌ BUTTON ERROR: ') +
				chalk.white(
					`No button matching ${chalk.yellow(
						interaction.customId
					)} was found.`
				)
		);
		return;
	}

	await button.execute(interaction);
	if (process.env?.DEBUG_MODE !== 'production') {
		console.log(
			chalk.blue('👆 BUTTON: ') +
				chalk.cyan(interaction.customId) +
				chalk.gray(` pressed by ${interaction.user.tag}`)
		);
	}
	return;
}

async function handleModalInteraction(interaction: any) {
	if (!interaction.isModalSubmit()) return;
	const modal = modals.get(interaction.customId);
	if (!modal)
		return `No modal matching ${interaction.customId} was found.`;
	try {
		await modal.execute(interaction);
		if (process.env?.DEBUG_MODE !== 'production') {
			console.log(
				chalk.green('📝 MODAL: ') +
					chalk.cyan(interaction.customId) +
					chalk.gray(` submitted by ${interaction.user.tag}`)
			);
		}
	} catch (error) {
		console.error(
			chalk.red('❌ MODAL ERROR: ') +
				chalk.white(
					`Error executing modal ${chalk.yellow(
						interaction.customId
					)}: ${error}`
				)
		);
		await handleInteractionError(interaction);
		return;
	}
}

async function handleInteractionError(interaction: any) {
	const errorMessage =
		'There was an error executing this interaction!';

	if (interaction.replied || interaction.deferred) {
		await interaction.followUp({
			content: errorMessage,
			flags: 'Ephemeral',
		});
	} else {
		await interaction.reply({
			content: errorMessage,
			flags: 'Ephemeral',
		});
	}
}
