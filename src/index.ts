import { setupClient } from './handlers/clientHandler';
import {
	loadCommands,
	registerCommands,
} from './handlers/commandHandler';
import { config } from './config';
import { loadButtons } from './handlers/buttonHandler';
import { connectDB } from './utils/ConnectToDB';
import { loadModals } from './handlers/modalHandler';

async function main() {
	await connectDB();
	await loadCommands();
	await registerCommands();
	await loadButtons();
	await loadModals();

	const client = await setupClient();
	client.login(config.token);
}

main().catch(console.error);
