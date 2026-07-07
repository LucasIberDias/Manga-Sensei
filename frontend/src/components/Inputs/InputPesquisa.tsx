import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./InputPesquisa.css";

export default function InputPesquisa() {
    const [pesquisa, setPesquisa] = useState("");

    return (
        <div className="input-pesquisa">
            <FaSearch />

            <input
                type="text"
                placeholder="Pesquisar mangá..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
            />
        </div>
    );
}