import mongoose from 'mongoose';

interface Reviews {
	user_id: string;
	stars: string[];
	reviewedAt: Date;
	comment: string;
	product: string;
	_id: string;
}

const reviewSchema = new mongoose.Schema<Reviews>({
	user_id: { type: 'string', required: true },
	stars: { type: [String], required: true },
	reviewedAt: { type: 'date', required: true },
	comment: { type: 'string', required: true },
	product: { type: 'string', required: true },
	_id: { type: 'string', required: true },
});

export const Reviews = mongoose.model<Reviews>(
	'Reviews',
	reviewSchema
);
