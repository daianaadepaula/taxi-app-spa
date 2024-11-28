import { Request, Response } from "express";
import axios from "axios";

import { Ride } from "../models/RideModel"; // Importa o modelo Ride
import { Driver } from "../models/DriverModel"; // Importando o modelo Driver
import { generateGoogleMapsUrl, generateStaticMapUrl } from "../utils/googleApi";

// Formato esperado da resposta da API do Google Maps
interface GoogleResponse {
	status: string;
	geocoded_waypoints: {
		geocoder_status: string;
		place_id?: string;
		types?: string[];
	}[];
	routes: {
		legs: {
			distance: { value: number };
			duration: { text: string };
			start_location: { lat: number; lng: number };
			end_location: { lat: number; lng: number };
		}[];
	}[];
}

// Rota que pega o id do usuário, origem e destino
export const estimateRide = async (req: Request, res: Response): Promise<void> => {
	try {
		const { customer_id, origin, destination } = req.body;

		// Validações
		if (!customer_id) {
			res.status(400).json({ error: "O ID do usuário não pode estar em branco." });
			return;
		}

		if (!origin || !destination || origin.trim() === "" || destination.trim() === "") {
			res.status(400).json({ error: "Endereços de origem e destino não podem estar vazios ou inválidos." });
			return;
		}

		if (origin === destination) {
			res.status(400).json({ error: "Origem e destino não podem ser o mesmo endereço." });
			return;
		}

		const apiKey = process.env.GOOGLE_API_KEY; // Chave da API 

		// Criação da URL do mapa estático
		const staticMapUrl = generateStaticMapUrl(origin, destination, apiKey!);

		// Chamada API do Google Maps para calcular a distância, tempo, etc.
		const url = generateGoogleMapsUrl(origin, destination, apiKey!);
		const { data } = await axios.get<GoogleResponse>(url);

		// Validação do retorno da API
		if (data.status !== "OK" || data.routes.length === 0) {
			if (data.geocoded_waypoints.some((point) => point.geocoder_status === "ZERO_RESULTS")) {
				res.status(400).json({ error: "Um ou ambos os endereços fornecidos são inválidos ou não foram encontrados." });
				return;
			}
			res.status(500).json({ error: "Erro ao calcular rota com a API do Google Maps." });
			return;
		}

		// Dados da rota
		const route = data.routes[0];
		const distance = route.legs[0].distance.value / 1000; // Distância em km
		const duration = route.legs[0].duration.text; // Tempo em texto
		const startLocation = route.legs[0].start_location;
		const endLocation = route.legs[0].end_location;

		// Pega os motoristas
		const drivers = await Driver.find();

		// Filtra motoristas pela distância mínima e calcula o preço total
		const availableDrivers = drivers
			.filter((driver) => distance >= driver.minKm)
			.map((driver) => ({
				id: driver.id,
				name: driver.name,
				vehicle: driver.vehicle,
				description: driver.description,
				review: driver.review,
				total: (distance * driver.value).toFixed(2),
			}))
			.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));

		// Retorno da resposta
		res.status(200).json({
			success: true,
			origin: startLocation,
			destination: endLocation,
			distance,
			duration,
			options: availableDrivers, // Motoristas filtrados
			staticMapUrl, // URL do mapa estático
		});
	} catch (error) {
		// Erros
		const err = error as Error;
		res.status(500).json({ success: false, error: "Erro inesperado.", description: err.message });
	}
};

// Confirmação da viagem
export const confirmRide = async (req: Request, res: Response): Promise<void> => {
	const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

	//Validações dos dados recebidos
	if (!origin || !destination) {
		res.status(400).json({ error: "Origem e destino não podem estar em branco." });
		return;
	}

	if (!customer_id) {
		res.status(400).json({ error: "ID do cliente é obrigatório." });
		return;
	}

	if (origin === destination) {
		res.status(400).json({ error: "Origem e destino não podem ser iguais." });
		return;
	}

	if (!driver || !driver.id || !driver.name) {
		res.status(404).json({ error_code: "DRIVER_NOT_FOUND", error: "Motorista inválido ou ausente." });
		return;
	}

	if (distance <= 0 || value <= 0) {
		res.status(406).json({ error: "DISTANCE_OR_VALUE_INVALID", error_message: "Distância ou valor inválidos." });
		return;
	}

	if (!customer_id || !origin || !destination || !driver) {
		res.status(400).json({ error: 'Dados inválidos. Todos os campos são obrigatórios.' });
		return;
	}


	try {
		// Checar se o motorista existe
		const existingDriver = await Driver.findOne({ id: driver.id }); // Busca pelo campo `id` numérico diretamente

		if (!existingDriver) {
			res.status(404).json({ error_code: "DRIVER_NOT_FOUND", error: "Motorista não encontrado." });
			return;
		}

		// Compara se o motorista da requisição é o mesmo motorista do banco de dados
		if (!existingDriver || existingDriver.id !== driver.id || existingDriver.name !== driver.name) {
			res.status(400).json({ error: "O motorista fornecido não corresponde ao motorista registrado no banco de dados." });
			return;
		}

		// Verifica a distância
		if (distance < existingDriver.minKm) {
			res.status(406).json({ error: `A distância mínima para este motorista é de ${existingDriver.minKm} km.` });
			return;
		}

		// Cria os dados da viagem
		const ride = new Ride({
			customerId: customer_id,
			origin,
			destination,
			distance,
			duration,
			driver: existingDriver,
			value,
		});

		// Salva a viagem no banco de dados
		const savedRide = await ride.save();
		console.log('Viagem salva:', savedRide);

		res.status(200).json({
			success: true,
			message: "Viagem confirmada com sucesso!",
			ride: savedRide,
		});

	} catch (error) {
		// Erro
		const err = error as Error;
		res.status(400).json({
			success: false,
			error: "Erro ao confirmar a viagem.",
			details: err.message,
		});
	}
};

// Mostra o histórico de viagem de um usuário e filtra os motoristas
export const getRides = async (req: Request, res: Response): Promise<void> => {
	try {
		const { customerId } = req.params; // Pega o customerId da URL
		const { driver_id } = req.query; // Pega o driver_id como query parameter (caso exista)

		// Validações 
		if (!customerId) {
			res.status(400).json({ error: "O ID do usuário não pode estar em branco." });
			return;
		}

		if (driver_id && isNaN(Number(driver_id))) {
			res.status(400).json({ error: "O ID do motorista informado não é válido." });
			return;
		}

		// Pega a viagem do usuário no banco de dados
		let ridesQuery = Ride.find({ customerId: customerId }).sort({ createdAt: -1 }); // Mais recentes primeiro

		// Se o motorista for informado, adiciona um filtro 
		if (driver_id) {
			ridesQuery = ridesQuery.where("driver.id").equals(Number(driver_id));
		}

		// Inclui as informações do motorista na resposta
		const rides = await ridesQuery.populate("driver");

		// Checa se o cliente já fez alguma viagem
		if (rides.length === 0) {
			res.status(404).json({
				error: "Nenhuma viagem encontrada para este cliente.",
			});
			return;
		}

		// Formatação do histórico de viagens
		const rideList = rides.map((ride) => ({
			id: ride.id,
			origin: ride.origin,
			destination: ride.destination,
			distance: ride.distance,
			duration: ride.duration,
			driver: {
				id: ride.driver?.id,
				name: ride.driver?.name,
			},
			value: ride.value,
			createdAt: ride.createdAt,
		}));

		res.status(200).json({
			customerId,
			rides: rideList,
		});
	} catch (error) {
		// Erro
		const err = error as Error;
		res.status(500).json({
			error: "Erro ao buscar as viagens.",
			description: err.message,
		});
	}
};
