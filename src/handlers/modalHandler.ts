import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Modal } from '../types/Modal';
import Logger from '../utils/Logger';

export const modals = new Collection<string, Modal>();

export async function loadModals() {
	const modalsPath = path.join(__dirname, '../modals');

	if (!fs.existsSync(modalsPath)) {
		fs.mkdirSync(modalsPath, { recursive: true });
		console.log('Created modals directory');
	}

	const modalFiles = fs
		.readdirSync(modalsPath)
		.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

	const loadedModals: string[] = [];
	const missingProperties: string[] = [];

	for (const file of modalFiles) {
		const filePath = path.join(modalsPath, file);
		let modal: Modal | undefined;
		try {
			modal = require(filePath).default as Modal;
		} catch (error) {
			console.error(
				`Failed to load modal from file: ${filePath}`,
				error
			);
			missingProperties.push(filePath);
			continue;
		}

		if (
			modal &&
			typeof modal === 'object' &&
			'customId' in modal &&
			'execute' in modal
		) {
			modals.set(modal.customId, modal);
			loadedModals.push(modal.customId);
		} else {
			missingProperties.push(filePath);
		}
	}

	if (loadedModals.length > 0) {
		Logger.Success(`Loaded modals: ${loadedModals.join(', ')}`);
	}

	if (missingProperties.length > 0) {
		console.error(
			`The following modals are missing required properties: ${missingProperties.join(
				', '
			)}`
		);
	}
}
