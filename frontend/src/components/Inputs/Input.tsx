import { FaUser, FaLock, FaEye, FaEnvelope } from "react-icons/fa";
import "./Input.css";

type InputProps = {
    tipo: string;
    texto: string;
    onChange?: (valor: string) => void;
};

export default function Input(props: InputProps) {
    return (
        <div className="input-login">

            {props.tipo === "user" && <FaUser />}

            {props.tipo === "email" && <FaEnvelope />}

            {props.tipo === "password" && <FaLock />}

            <input
                type={props.tipo === "user" ? "text" : props.tipo}
                placeholder={props.texto}
                onChange={(e) => props.onChange?.(e.target.value)}
            />

            {props.tipo === "password" && <FaEye />}

        </div>
    );
}