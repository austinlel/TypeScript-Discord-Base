import * as mongoose from 'mongoose';

interface Tickets {
	ticket_id: string;
	owner_id: string;
	createdAt: Date;
	status: string;
	_id: string;
}

const ticketSchema = new mongoose.Schema<Tickets>({
	ticket_id: { type: 'string', required: true },
	owner_id: { type: 'string', required: true },
	status: { type: 'string', required: true },
	createdAt: { type: 'date', required: true },
	_id: { type: 'string', required: true },
});

export const Ticket = mongoose.model<Tickets>('Ticket', ticketSchema);
