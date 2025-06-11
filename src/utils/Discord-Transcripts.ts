import * as discordTranscripts from 'discord-html-transcripts';

export async function createTranscript(
	interaction: any,
	channel: any
) {
	if (!channel || !interaction) {
		throw new Error('Channel or interaction is missing.');
	}

	const transcript = await discordTranscripts.createTranscript(
		channel
	);
	return transcript;
}
