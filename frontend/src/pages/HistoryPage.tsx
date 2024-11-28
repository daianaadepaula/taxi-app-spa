import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRideHistory } from "../api";
import ErrorMessage from "../components/ErrorMessage";

const HistoryPage = () => {
  const { customerId: paramCustomerId } = useParams();
  const [customerId, setCustomerId] = useState(paramCustomerId || "");
  const [driverId, setDriverId] = useState("");
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
	const [isDriversLoaded, setIsDriversLoaded] = useState(false);
	
  // Busca o histórico de viagens e motoristas
  const fetchHistory = async (customerId: string, driverId: string = "") => {
    try {
      setError("");
      setRides([]); // Limpa as viagens
      setDrivers([]); // Limpa os motoristas
      setIsDriversLoaded(false);

      if (!customerId) {
        throw new Error("ID do usuário não fornecido.");
      }

      const data = await fetchRideHistory(customerId, driverId);
      setRides(data.rides);

      // Filtro de motoristas únicos
      if (data.rides.length > 0) {
        const uniqueDrivers = Array.from(
          new Set(data.rides.map((ride: any) => ride.driver.id))
        ).map((id) => {
          const driver = data.rides.find((ride: any) => ride.driver.id === id);
          return { id: driver.driver.id, name: driver.driver.name };
        });
        setDrivers(uniqueDrivers);
        setIsDriversLoaded(true); // Habilita o seletor
      } else {
        setIsDriversLoaded(false); // Não habilita se não houver motoristas
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Carrega os motorista e as viagens
  useEffect(() => {
    if (customerId) {
      fetchHistory(customerId);
    }
  }, [customerId]);

  // Filtra as viagens ao clicar no botão
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(customerId, driverId);
  };

  return (
    <div className="container">
      <h2 className="subtitle">Histórico de Viagens</h2>
			<form
				className="flex flex-col"
				onSubmit={handleFilterSubmit}
			>
				<div className="flex">
					<input
						type="text"
						name="customer_id"
						placeholder="ID do Usuário"
						value={customerId}
						onChange={(e) => setCustomerId(e.target.value)}
						className="input"
					/>

					<select
						name="driver_id"
						value={driverId}
						onChange={(e) => setDriverId(e.target.value)}
						className="input"
						disabled={!isDriversLoaded} 
					>
						<option value="">Todos os Motoristas</option>
						{drivers.map((driver) => (
							<option key={driver.id} value={driver.id}>
								{driver.name}
							</option>
						))}
					</select>
				</div>

        <button
          type="submit"
          className="btn"
        >
          Aplicar Filtro
        </button>
      </form>

			<ErrorMessage message={error} /> 
			
      {/* Lista de viagens */}
      <div className="containerCard mt-4">
          {rides.map((ride: any) => (
            <div key={ride.id} className="cardList">
              <p>
                <strong>Data:</strong>{" "}
                {new Date(ride.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Motorista:</strong> {ride.driver.name}
              </p>
              <p>
                <strong>Origem:</strong> {ride.origin}
              </p>
              <p>
                <strong>Destino:</strong> {ride.destination}
              </p>
              <p>
                <strong>Distância:</strong> {ride.distance} Km
              </p>
              <p>
                <strong>Tempo:</strong> {ride.duration}
              </p>
              <p>
                <strong>Valor:</strong> R$ {ride.value}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HistoryPage;
