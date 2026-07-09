import { FaSearch } from "react-icons/fa";
import "./InputPesquisa.css";

export default function InputPesquisa() {
    return (
        <div className="input-pesquisa">
            <FaSearch />

            <input
                type="text"
                placeholder="Pesquisar mangá..."
            />
        </div>
    );
}