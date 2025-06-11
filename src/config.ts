import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
	token: process.env.DISCORD_TOKEN as string, // Token must be a string
	clientId: process.env.CLIENT_ID as string, // Client ID must be a string
	guildId: process.env.GUILD_ID as string, // Guild ID must be a string
};
