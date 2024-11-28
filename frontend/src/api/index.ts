import axios from "axios";

interface EstimateRideResponse {
	staticMapUrl: string; // URL do mapa estático
	origin: { lat: number; lng: number }; // Coordenadas de origem
	destination: { lat: number; lng: number }; // Coordenadas de destino
	distance: number; // Distância da viagem
	duration: string; // Duração da viagem
	options: Array<{
		id: string;
		name: string;
		vehicle: string;
		total: string; // Preço total
	}>; // Opções de motoristas disponíveis
}

const api = axios.create({
	baseURL: "http://127.0.0.1:8080", // URL do backend
});

// Chamar a API estimateRide
export const estimateRide = async (payload: any): Promise<EstimateRideResponse> => {
	try {
		const response = await axios.post<EstimateRideResponse>("http://127.0.0.1:8080/ride/estimate", payload);
		console.log("Payload enviado para estimateRide:", payload);

		return response.data;
	} catch (error: any) {
		console.error("Erro no backend:", error.response?.data);
		throw new Error(error.response?.data?.error || "Erro ao estimar a viagem");
	}
};

// Exibir o mapa estático no frontend
const showMap = async ({ customer_id: customerId, origin, destination }: {
	customer_id: string;
	origin: string;
	destination: string;
}) => {
	const payload = {
		customer_id: customerId,
		origin,
		destination,
	};
	console.log('Payload enviado:', payload);

	try {
		const data = await estimateRide(payload);

		// Exibe o mapa estático
		const mapUrl = data.staticMapUrl; // Agora o TypeScript reconhece este campo
		const imgElement = document.createElement('img');
		imgElement.src = mapUrl;
		imgElement.alt = "Mapa da viagem";

		// Adiciona o mapa na página
		document.body.appendChild(imgElement);
	} catch (error: any) {
		console.error("Erro ao exibir o mapa:", error);
	}
};

showMap({
	customer_id: "12345", // Exemplo de ID do cliente
	origin: "Rua A, Cidade X",
	destination: "Rua B, Cidade Y"
});

// Chamar a API confirmRide
export const confirmRide = async (payload: any) => {
	try {
		const response = await api.patch("/ride/confirm", payload);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.error || "Erro ao confirmar a viagem");
	}
};

// Chamar a API fetchRideHistory
export const fetchRideHistory = async (customerId: string, driverId?: string) => {
	try {
		const params = driverId ? { driver_id: driverId } : {};
		const response = await api.get(`/ride/${customerId}`, { params });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.error || "Erro ao buscar histórico de viagens");
	}
};
