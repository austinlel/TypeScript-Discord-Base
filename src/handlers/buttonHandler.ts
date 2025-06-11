import { Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { Button } from '../types/Button';
import Logger from '../utils/Logger';

export const buttons = new Collection<string, Button>();

export async function loadButtons() {
	const buttonsPath = path.join(__dirname, '../buttons');

	if (!fs.existsSync(buttonsPath)) {
		fs.mkdirSync(buttonsPath, { recursive: true });
		console.log('Created buttons directory');
	}

	const buttonFiles = fs
		.readdirSync(buttonsPath)
		.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

	const loadedButtons: string[] = [];
	const missingProperties: string[] = [];

	for (const file of buttonFiles) {
		const filePath = path.join(buttonsPath, file);
		let button: Button | undefined;
		try {
			button = require(filePath).default as Button;
		} catch (error) {
			console.error(
				`Failed to load button from file: ${filePath}`,
				error
			);
			missingProperties.push(filePath);
			continue;
		}

		if (
			button &&
			typeof button === 'object' &&
			'customId' in button &&
			'execute' in button
		) {
			buttons.set(button.customId, button);
			loadedButtons.push(button.customId);
		} else {
			missingProperties.push(filePath);
		}
	}

	if (loadedButtons.length > 0) {
		Logger.Success(`Loaded buttons: ${loadedButtons.join(', ')}`);
	}

	if (missingProperties.length > 0) {
		console.error(
			`The following buttons are missing required properties: ${missingProperties.join(
				', '
			)}`
		);
	}
}
