import mongoose, { Document, Schema } from 'mongoose';

interface IExample extends Document {
	guild_id: string;
	user_id: string;
}

const exampleSchema = new Schema<IExample>({
	guild_id: {
		type: String,
		required: true,
		trim: true,
	},
	user_id: {
		type: String,
		required: true,
		trim: true,
	},
});

export const Example = mongoose.model<IExample>(
	'Example',
	exampleSchema
);
