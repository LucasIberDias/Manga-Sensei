import Input from "../../components/Inputs/Input";
import Button from "../../components/Buttons/Buttons";
import ButtonLink from "../../components/Buttons/ButtonNavegacao";
import Logo from "../../components/Logo";
import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <div className="login-container">
                <Logo />

                <h2>LOGIN</h2>
                <p className="login-subtitulo">
                    Faça login na sua conta e tenha uma coleção organizada!
                </p>

                <label>E-mail</label>
                <Input tipo="email" texto="Digite seu e-mail" onChange={setEmail} />

                <label>Senha</label>
                <Input tipo="password" texto="Digite sua senha" onChange={setSenha} />

                <div className="login-buttons">
                    <ButtonLink destino="cadastro" texto="CADASTRAR" cor="secundaria" />
                    <Button tipo="submit" texto="ENTRAR" cor="primaria" onClick={fazerLogin} />
                </div>
            </div>
        </div>
    );

    async function fazerLogin() {
        const resposta = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
                senha,
            }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            navigate("/inicio");
        }else{
            alert(dados.erro);
        }
    }
}

