import { Link } from "react-router-dom";
import "./Buttons.css";

type ButtonLinkProps = {
    texto: string;
    cor: "primaria" | "secundaria";
    destino: string;
};

export default function ButtonLink(props: ButtonLinkProps) {
    return (
        <Link
            to={props.destino}
            className={`button ${props.cor}`}
        >
            {props.texto}
        </Link>
    );
}