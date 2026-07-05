import express from "express";
import cors from "cors";
import { pool } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend do Mangá Sensei funcionando!",
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");

        res.json({
            conectado: true,
            data: resultado.rows[0],
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            conectado: false,
            erro: "Falha ao conectar ao banco",
        });
    }
});

const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.post("/login", async (req, res) => {
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

    if (usuario.senha_hash !== senha) {
        return res.status(401).json({
            erro: "Senha incorreta"
        });
    }

    res.json({
        sucesso: true,
        usuario: usuario.nome_usuario
    });
});

app.post("/cadastro", async (req, res) => {
    const {
        nome_usuario,
        email,
        senha_hash,
    } = req.body;

    try {
        if (!nome_usuario || !email || !senha_hash) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
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

        if (senha_hash.length < 8) {
            return res.status(422).json({
                erro: "Adicione pelo menos 8 Digitos na senha"
            });
        }

        const resultado = await pool.query(
            `
        INSERT INTO usuario
        (nome_usuario, email, senha_hash)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
            [
                nome_usuario,
                email,
                senha_hash,
            ]
        );

        res.status(201).json({
            sucesso: "Conta criada com sucesso"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao cadastrar usuário",
        });
    }
});

app.post("/coletar", async (req, res) => {
    try {
        const manga = req.body;

        const resultado = await pool.query(
            `
            INSERT INTO manga
            (
                titulo,
                capa,
                autor,
                editora,
                quantidade_volumes,
                demografia
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                manga.titulo,
                manga.capa,
                manga.autor,
                manga.editora,
                manga.quantidadeVolumes,
                manga.demografia
            ]
        );

        const mangaSalvo = resultado.rows[0];

        for (const volume of manga.volumes) {
            await pool.query(
                `
                INSERT INTO volume_manga
                (
                    manga_id,
                    numero_volume,
                    isbn,
                    capa_volume
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    mangaSalvo.id,
                    volume.numero,
                    volume.isbn,
                    volume.capa
                ]
            );
        }

        return res.status(201).json({
            message: "Manga salvo com sucesso",
            id: mangaSalvo.id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao salvar manga"
        });
    }
});