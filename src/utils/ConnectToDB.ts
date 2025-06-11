import mongoose from 'mongoose';

export async function connectDB() {
	const mongooseUrl = process.env.MONGOOSE_URL;
	if (typeof mongooseUrl !== 'string') {
		throw new Error(
			'MONGOOSE_URL is not defined in the environment variables & or is not a string.'
		);
	}
	await mongoose.connect(mongooseUrl);
}
