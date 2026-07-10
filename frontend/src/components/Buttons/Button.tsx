import "./Button.css";
import type { IconType } from "react-icons";

type ButtonProps = {
    tipo: "submit" | "reset" | "button";
    texto: string;
    cor: "primaria" | "secundaria" | "terciaria";
    Icon?: IconType;
    onClick?: () => void;
};

export default function Button({
    tipo,
    texto,
    cor,
    Icon,
    onClick,
}: ButtonProps) {
    return (
        <button
            className={`button ${cor}`}
            type={tipo}
            onClick={onClick}
        >
            {Icon && <Icon />}
            <span>{texto}</span>
        </button>
    );
}