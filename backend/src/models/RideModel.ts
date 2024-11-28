import mongoose, { Schema, Document } from "mongoose";

// Define a estrutura do documento que representa uma viagem 
export interface IRide extends Document {
	customerId: string;
	origin: string;
	destination: string;
	distance: number;
	duration: string;
	driver: {
		id: number;
		name: string;
	};
	value: number;
	createdAt: Date;
}

// Defini a coleção de viagens (representadas pelo modelo Ride)
const RideSchema: Schema = new Schema({
	customerId: { type: String, required: true },
	origin: { type: String, required: true },
	destination: { type: String, required: true },
	distance: { type: Number, required: true },
	duration: { type: String, required: true },
	driver: {
		id: { type: Number, required: true },
		name: { type: String, required: true },
	},
	value: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

// Criando o modelo Ride
export const Ride = mongoose.model<IRide>("Ride", RideSchema);
