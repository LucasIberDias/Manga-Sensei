import { NavLink } from "react-router-dom";
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
        <NavLink
            to={destino}
            className={({ isActive }) =>
                isActive ? "link-navegacao ativo" : "link-navegacao"
            }
        >
            {Icon && <Icon />}
            <span>{texto}</span>
        </NavLink>
    );
}