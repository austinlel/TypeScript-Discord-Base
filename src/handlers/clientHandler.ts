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
	console.clear();
	client.user?.setActivity({
		name: `Austin Develop`,
		type: ActivityType.Watching,
	});
	client.user?.setPresence({ status: 'dnd' });

	logInfo('🤖 Bot User:', chalk.cyan(client.user?.tag));
	logInfo('✅ Client Status:', chalk.green('OPERATIONAL'));

	if (process.env?.USE_DATABASE !== 'true') {
		logWarning('⚠️ Database:', chalk.red('DISABLED'));
		logInfo(
			'   └─ Set USE_DATABASE=true to enable MongoDB connection'
		);
		return;
	}

	const mongooseUrl = process.env?.MONGOOSE_URL;
	if (typeof mongooseUrl !== 'string') {
		throw new Error(
			'MONGOOSE_URL is not defined in the environment variables or is not a string.'
		);
	}

	logInfo('🔗 Connecting to MongoDB...');
	await mongoose.connect(mongooseUrl);
	logInfo('✅ Database:', chalk.green('CONNECTED'));

	logSeparator();
	logInfo('Bot is now running!');
	logSeparator();
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
		logError('❌ ERROR:');
		await handleInteractionError(interaction);
	}
}

async function handleCommandInteraction(interaction: any) {
	const command = commands.get(interaction.commandName);

	if (!command) {
		logError(
			'❌ COMMAND ERROR:',
			`No command matching ${chalk.yellow(
				interaction.commandName
			)} was found.`
		);
		return;
	}

	await command.execute(interaction);
	logDebug(
		'⚡ COMMAND:',
		`${chalk.cyan(interaction.commandName)} executed by ${
			interaction.user.tag
		}`
	);
}

async function handleButtonInteraction(interaction: any) {
	const button = buttons.get(interaction.customId);

	if (!button) {
		logError(
			'❌ BUTTON ERROR:',
			`No button matching ${chalk.yellow(
				interaction.customId
			)} was found.`
		);
		return;
	}

	await button.execute(interaction);
	logDebug(
		'👆 BUTTON:',
		`${chalk.cyan(interaction.customId)} pressed by ${
			interaction.user.tag
		}`
	);
}

async function handleModalInteraction(interaction: any) {
	if (!interaction.isModalSubmit()) return;
	const modal = modals.get(interaction.customId);

	if (!modal) {
		logError(
			'❌ MODAL ERROR:',
			`No modal matching ${chalk.yellow(
				interaction.customId
			)} was found.`
		);
		return;
	}

	try {
		await modal.execute(interaction);
		logDebug(
			'📝 MODAL:',
			`${chalk.cyan(interaction.customId)} submitted by ${
				interaction.user.tag
			}`
		);
	} catch (error) {
		logError(
			'❌ MODAL ERROR:',
			`Error executing modal ${chalk.yellow(
				interaction.customId
			)}: ${error}`
		);
		await handleInteractionError(interaction);
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

function logInfo(label: string, message?: string) {
	console.log(chalk.green(label), message || '');
}

function logWarning(label: string, message?: string) {
	console.log(chalk.yellow(label), message || '');
}

function logError(label: string, message?: string) {
	console.error(chalk.red(label), message || '');
}

function logDebug(label: string, message?: string) {
	if (process.env?.DEBUG_MODE !== 'production') {
		console.log(chalk.gray(label), message || '');
	}
}

function logSeparator() {
	console.log(chalk.magenta('═'.repeat(80)));
}
