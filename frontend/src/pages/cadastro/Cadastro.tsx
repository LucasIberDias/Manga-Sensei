import Input from "../../components/Inputs/Input";
import Button from "../../components/Buttons/Button";
import ButtonLink from "../../components/Buttons/ButtonNavegacao";
import Logo from "../../components/Logo";
import "./Cadastro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tst_senha, setTst_senha] = useState("");
    const navigate = useNavigate();

    return (
        <div className="cadastro-page">
            <div className="cadastro-container">
                <Logo />

                <h2>Cadastre-se</h2>
                <p className="cadastro-subtitulo">
                    Crie uma conta e comece a gerenciar seus mangás e HQ's
                </p>

                <label>Usuário</label>
                <Input tipo="user" texto="Escolha um nome de usuário" onChange={setUsuario} />

                <label>E-mail</label>
                <Input tipo="email" texto="Digite seu e-mail" onChange={setEmail} />

                <label>Senha</label>
                <Input tipo="password" texto="Crie uma senha com mínimo de 8 dígitos" onChange={setSenha} />

                <label>Repetir Senha</label>
                <Input tipo="password" texto="Repita a senha anterior" onChange={setTst_senha} />

                <div className="cadastro-buttons">
                    <ButtonLink destino="/" texto="VOLTAR" cor="secundaria" />

                    <Button tipo="submit" texto="CRIAR CONTA" cor="primaria" onClick={criarConta} />
                </div>
            </div>
        </div>
    );

    async function criarConta() {
        if (senha !== tst_senha) {
            console.error("As senhas não correspondem.");
            return;
        }

        const resposta = await fetch("http://localhost:3000/auth/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome_usuario: usuario,
                email: email.toLowerCase(),
                senha: senha
            }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Conta criada com sucesso!");
            navigate("/");
        } else {
            alert(dados.erro);
        }
    }
}