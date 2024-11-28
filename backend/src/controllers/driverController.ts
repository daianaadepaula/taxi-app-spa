import { Request, Response } from "express";
import { Driver } from "../models/DriverModel"; // Importa o modelo Driver

export const createDriver = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id, name, description, vehicle, review, value, minKm } = req.body;

		// Criação de um novo motorista
		const newDriver = new Driver({
			id,
			name,
			description,
			vehicle,
			review,
			value,
			minKm,
		});

		// Salva o novo motorista no banco de dados
		await newDriver.save();

		// Mostra o motorista criado
		res.status(201).json(newDriver);
	} catch (error) {
		// Erros
		const err = error as Error;
		res.status(500).json({ message: "Erro na rota createDriver: ", error: err.message });
	}
};

// Lista todos os motoristas
export const getAllDrivers = async (req: Request, res: Response): Promise<void> => {
	try {
		// Encontra o motorista no banco de dados
		const drivers = await Driver.find();

		res.status(200).json(drivers);
	} catch (error) {
		// Erros
		const err = error as Error;
		res.status(500).json({ message: "Erro na rota getAllDrivers: ", error: err.message });
	}
};
