import mongoose, { Schema, Document } from "mongoose";

// Descreve o modelo de motorista
export interface IReview {
	rating: string;
	comment: string;
}

export interface IDriver extends Document {
	id: number;
	name: string;
	description: string;
	vehicle: string;
	review: IReview;
	value: number;
	minKm: number;
}

// Esquema de review
const ReviewSchema: Schema = new Schema({
	rating: { type: String, required: true },
	comment: { type: String, required: true },
});

// Esquema do motorista
const DriverSchema: Schema = new Schema({
	id: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	vehicle: { type: String, required: true },
	review: { type: ReviewSchema, required: true },
	value: { type: Number, required: true },
	minKm: { type: Number, required: true },
});

// Criando o modelo Driver
export const Driver = mongoose.model<IDriver>("Driver", DriverSchema);
