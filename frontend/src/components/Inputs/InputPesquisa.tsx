import { FaSearch } from "react-icons/fa";
import "./InputPesquisa.css";

type InputPesquisaProps = {
    value: string;
    onChange: (valor: string) => void;
    onEnter?: () => void;
};

export default function InputPesquisa({
    value,
    onChange,
    onEnter,
}: InputPesquisaProps) {
    return (
        <div className="input-pesquisa">

            <FaSearch />

            <input
                type="text"
                placeholder="Pesquisar mangá..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onEnter?.();
                    }
                }}
            />

        </div>
    );
}