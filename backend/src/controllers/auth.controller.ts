import { Request, Response } from "express";
import { pool } from "../config/database";
import bcrypt from "bcrypt";


export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, senha } = req.body;

        const resultado = await pool.query(
            "SELECT * FROM usuario WHERE email = $1",
            [email]
        );

        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(401).json({
                erro: "Usuário não encontrado"
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: "Senha incorreta"
            });
        }

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: "Erro no login"
        });
    }
};

export const cadastro = async (
    req: Request,
    res: Response
) => {
    try {
        const { nome_usuario, email, senha } = req.body;

        if (!nome_usuario || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos." });
        }

        if (senha.length < 8) {
            return res.status(422).json({
                erro: "Senha deve ter pelo menos 8 caracteres"
            });
        }

        const emailTeste = await pool.query(
            "SELECT * FROM usuario WHERE email = $1",
            [email]
        );

        if (emailTeste.rows.length > 0) {
            return res.status(400).json({
                erro: "E-mail já cadastrado"
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.query(
            `
            INSERT INTO usuario (nome_usuario, email, senha_hash)
            VALUES ($1, $2, $3)
            `,
            [nome_usuario, email, senhaHash]
        );

        return res.status(201).json({
            sucesso: "Conta criada com sucesso"
        });

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            erro: "Erro ao cadastrar usuário"
        });
    }
};