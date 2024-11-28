import { Link } from "react-router-dom";
import { AiFillCar } from "react-icons/ai";
import { ImExit } from "react-icons/im";

const Header = () => {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
      {/* Parte centralizada (ícone + texto) */}
      <div className="flex items-center">
        <AiFillCar size={30} className="mr-2" />
        <h1 className="text-2xl font-bold">Taxi App</h1>
      </div>

      <Link to="/" className="text-white hover:text-gray-300">
        <ImExit size={30} />
      </Link>
    </header>
  );
}

export default Header;
