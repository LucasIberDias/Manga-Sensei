import { FaSearch } from "react-icons/fa";
import "./InputPesquisa.css";

type Props = {
    value: string;
    onChange: (valor: string) => void;
    onPesquisar?: () => void;
};

export default function InputPesquisa({
    value,
    onChange,
    onPesquisar
}: Props) {
    return (
        <div className="input-pesquisa">
            <FaSearch />

            <input
                type="text"
                placeholder="Pesquisar mangá..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && onPesquisar) {
                        onPesquisar();
                    }
                }}
            />
        </div>
    );
}