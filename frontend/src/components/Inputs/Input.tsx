import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import "./Input.css";

type InputProps = {
    tipo: string;
    texto: string;
    onChange?: (valor: string) => void;
};

export default function Input(props: InputProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <div className="input-login">

            {props.tipo === "user" && <FaUser />}

            {props.tipo === "email" && <FaEnvelope />}

            {props.tipo === "password" && <FaLock />}

            <input
                type={
                    props.tipo === "password"
                        ? (mostrarSenha ? "text" : "password")
                        : props.tipo === "user"
                        ? "text"
                        : props.tipo
                }
                placeholder={props.texto}
                onChange={(e) => props.onChange?.(e.target.value)}
            />

            {props.tipo === "password" &&
                (mostrarSenha ? (
                    <FaEyeSlash
                        onClick={() => setMostrarSenha(false)}
                        style={{ cursor: "pointer" }}
                    />
                ) : (
                    <FaEye
                        onClick={() => setMostrarSenha(true)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
        </div>
    );
}