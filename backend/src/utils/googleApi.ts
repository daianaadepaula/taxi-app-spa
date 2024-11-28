// Limpa e formata os endereços
export const formatAddress = (address: string): string => {
	if (!address || typeof address !== "string") {
		throw new Error("O endereço informado é inválido.");
	}
	return encodeURIComponent(address.trim().replace(/\s+/g, " ")); // Remove espaços extras
};

// Gera o URL do Google Maps
export const generateGoogleMapsUrl = (origin: string, destination: string, apiKey: string): string => {
	if (!apiKey) {
		throw new Error("A chave da API do Google não está configurada.");
	}

	// Formata os endereços
	const formattedOrigin = formatAddress(origin);
	const formattedDestination = formatAddress(destination);

	return `https://maps.googleapis.com/maps/api/directions/json?origin=${formattedOrigin}&destination=${formattedDestination}&key=${apiKey}`;
};

// Gera a URL do mapa estático
export const generateStaticMapUrl = (origin: string, destination: string, apiKey: string): string => {
	if (!apiKey) {
		throw new Error("A chave da API do Google não está configurada.");
	}

	// Formata os endereços
	const formattedOrigin = formatAddress(origin);
	const formattedDestination = formatAddress(destination);

	return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=${formattedOrigin}&markers=${formattedDestination}&path=${formattedOrigin}|${formattedDestination}&key=${apiKey}`;
};
