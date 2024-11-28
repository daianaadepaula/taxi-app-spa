import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer"
import Header from "./components/Header"

import HomePage from "./pages/HomePage";
import OptionsPage from "./pages/OptionsPage";
import HistoryPage from "./pages/HistoryPage";

const App = () => {
	return (		
		<div className="flex flex-col min-h-screen bg-secondary-100">
			<Header />
			<main className="flex-grow container mx-auto px-4 py-6">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/opcoes-de-viagem/:customerId" element={<OptionsPage />} />
					<Route path="/historico-de-viagem/:customerId" element={<HistoryPage />} />
				</Routes>
			</main>
			<Footer />
		</div>
  )
}

export default App