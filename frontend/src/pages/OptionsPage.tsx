import{ useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { confirmRide } from "../api";
import ErrorMessage from "../components/ErrorMessage";

const OptionsPage = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { search, state } = useLocation();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    setOrigin(params.get("origin") || "");
    setDestination(params.get("destination") || "");
  }, [search]);

  const handleConfirm = async (driver: any) => {
    try {
      await confirmRide({
        customer_id: customerId,
        origin,
        destination,
        distance: state.distance,
        duration: state.duration,
        driver,
        value: driver.total,
      });

			console.log(driver)

      navigate(`/historico-de-viagem/${customerId}`, {
        state: {
          customer_id: customerId,
          origin,
          destination,
        },
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2 className="subtitle">Opções de Viagem</h2>
      <ErrorMessage message={error} /> 
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
				<label htmlFor="usuario">
					ID do Usuário
					<input
						name="usuario"
						type="text"
						placeholder="ID do Usuário"
						className="input"
						value={customerId}
						disabled
					/>
				</label>
				<label htmlFor="origem">Origem
					<input
						name="origem"
						type="text"
						placeholder="Origem"
						className="input"
						value={origin}
						disabled
						/>
				</label>
				<label htmlFor="destino">Destino
					<input
						name="destino"
						type="text"
						placeholder="Destino"
						className="input"
						value={destination}
						disabled
					/>
				</label>
			</div>

			{/* motoristas */}
      <div className="containerCard">
        {state.options.map((driver: any) => (
          <ul
            key={driver.id}
            className="card"
          >
            <li>
              <p>
                <strong> Motorista:</strong> {driver.name}
              </p>
            </li>
            <li>
              <p>
                <strong> Descrição:</strong> {driver.description}
              </p>
            </li>
            <li>
              <p>
                <strong> Veículo:</strong> {driver.vehicle}
              </p>
            </li>
            <li>
              <p>
                <strong> Avaliação:</strong> {driver.review.rating}
              </p>
            </li>
            <li>
              <p>
                <strong> Total:</strong> R$ {driver.total}
              </p>
            </li>
            <li>
              <button
                onClick={() => handleConfirm(driver)}
                className="btn"
              >
                Escolher
              </button>
            </li>
          </ul>
        ))}
			</div>
			
			{/* mapa estático */}

      <div>
				{customerId && origin && destination && (
					<Map customerId={customerId} origin={origin} destination={destination} />
				)}
			</div>

    </div>
  );
};

export default OptionsPage;
