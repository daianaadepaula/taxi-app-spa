import React, { useState } from "react";
import { estimateRide } from "../api"; 
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

type MapProps = {
  customerId: string;
  origin: string;
  destination: string;
};

const Map: React.FC<MapProps> = ({ customerId, origin, destination }) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMap = async () => {
    try {
      setError(null); // Limpa erros anteriores
      const payload = { customer_id: customerId, origin, destination };

      // Chama a API
      const data = await estimateRide(payload);

      // Atualiza o estado com a URL do mapa estático
      setMapUrl(data.staticMapUrl);

    } catch (err: any) {
      setError(err.message || "Erro ao carregar o mapa.");
    }
  };

  // Pega o mapa quando o componente é renderizado
  React.useEffect(() => {
    fetchMap();
  }, [customerId, origin, destination]);

  return (
    <div className="container mt-4">
      <h2 className="subtitle">Mapa da Viagem</h2>

			<ErrorMessage message={error} />

      {mapUrl ? (
        <img
          src={mapUrl}
          alt={`Mapa da viagem de ${origin} para ${destination}`}
          style={{ width: "100%", height: "auto", border: "1px solid #ccc" }}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Map;
