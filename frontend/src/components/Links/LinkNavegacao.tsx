import { Link } from "react-router-dom";
import "./LinkNavegacao.css";
import type { IconType } from "react-icons";

type LinkProps = {
    texto: string;
    destino: string;
    Icon?: IconType;
};

export default function LinkNavegacao({
    texto,
    destino,
    Icon,
}: LinkProps) {
    return (
        <Link to={destino} className="link-navegacao">
            {Icon && <Icon/>}
            <span>{texto}</span>
        </Link>
    );
}