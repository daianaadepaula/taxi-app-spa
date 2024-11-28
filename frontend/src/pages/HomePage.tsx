import { useState } from "react";
import yellowCar from "../assets/banner-car.png";
import { useNavigate } from "react-router-dom";
import { estimateRide } from "../api";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = () => {
	const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEstimate = async (event: React.FormEvent) => {
		event.preventDefault();
		if (customerId && origin && destination) { 
			try {
				setError("");
				const data = await estimateRide({ customer_id: customerId, origin, destination });
				navigate(`/opcoes-de-viagem/${customerId}?origin=${origin}&destination=${destination}`, { state: data });
			} catch (err: any) {
				setError(err.message);
			}
		} else { 
			alert('Todos os campos são obrigatórios');
		}
		
  };

	return (
      <div className="container">
        <div className="containerBox">
          <div
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-once="false"
            className="order-1 sm:order-2"
          >
            <img
              src={yellowCar}
              alt="carro amarelo"
              className="sm:scale-125 -z-10 max-h-[700px] animate-jump animate-twice animate-duration-1000 animate-ease-out"
            />
          </div>
          <div className="space-y-7 order-2 w-full sm:order-1 sm:pr-32 ">
					{/* Formulário */}
							<h1 className="title">Solicitar Viagem</h1>
							<ErrorMessage message={error} /> 
							<form>
								<input
									type="text"
									placeholder="ID do Usuário"
									value={customerId}
									onChange={(e) => setCustomerId(e.target.value)}
									className="input"
								/>
								<input
									type="text"
									placeholder="Endereço de Origem"
									value={origin}
									onChange={(e) => setOrigin(e.target.value)}
									className="input"
								/>
								<input
									type="text"
									placeholder="Endereço de Destino"
									value={destination}
									onChange={(e) => setDestination(e.target.value)}
									className="input"
								/>
								<button
									type="submit"
									onClick={handleEstimate}
									className="btn mt-2"
								>
									Estimar Viagem
								</button>
								</form>
          </div>
        </div>
      </div>
	)
}

export default HomePage