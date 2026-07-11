import { Request, Response } from "express";
import { pool } from "../config/database";
import { PoolClient } from "pg";
import { spawn } from "child_process";
import path from "path";

interface VolumeScraped {
    numero: string;
    capa: string;
    isbn: string;
}

interface MangaScraped {
    titulo: string;
    capa: string;
    autor: string;
    editora: string;
    demografia: string;
    quantidadeVolumes: number;
    generos: string[];
    volumes: VolumeScraped[];
    erro?: string;
}

interface explorarMangas {
    titulo: string;
    capa: string;
    editora: string;
    demografia: string;
    quantidadeVolumes: number;
}

const buscarMangaNoScraper = (nomeManga: string): Promise<MangaScraped> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "..", "scripts", "scraper.py");
        const processo = spawn("python3", [scriptPath, nomeManga]);

        let dados = "";
        let erroDados = "";

        processo.stdout.on("data", (chunk) => (dados += chunk.toString()));
        processo.stderr.on("data", (chunk) => (erroDados += chunk.toString()));

        processo.on("close", (codigo) => {
            if (codigo !== 0) {
                return reject(new Error(`Scraper finalizou com erro: ${erroDados}`));
            }
            try {
                const resultado: MangaScraped = JSON.parse(dados);
                if (resultado.erro) {
                    return reject(new Error(resultado.erro));
                }
                resolve(resultado);
            } catch {
                reject(new Error("Falha ao interpretar retorno do scraper"));
            }
        });
    });
};

const obterOuCriarGenero = async (client: PoolClient, nomeGenero: string): Promise<number> => {
    const existente = await client.query(
        "SELECT id FROM generos WHERE nome = $1",
        [nomeGenero]
    );

    if (existente.rows.length > 0) {
        return existente.rows[0].id;
    }

    const criado = await client.query(
        "INSERT INTO generos (nome) VALUES ($1) RETURNING id",
        [nomeGenero]
    );

    return criado.rows[0].id;
};

const buscarGenerosDoManga = async (client: PoolClient, mangaId: number): Promise<string[]> => {
    const resultado = await client.query(
        `SELECT g.nome FROM generos g
         INNER JOIN manga_generos mg ON mg.genero_id = g.id
         WHERE mg.manga_id = $1
         ORDER BY g.nome`,
        [mangaId]
    );

    return resultado.rows.map((linha) => linha.nome);
};

export const pesquisarManga = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { nomeManga } = req.body;

        if (!nomeManga || typeof nomeManga !== "string" || !nomeManga.trim()) {
            return res.status(400).json({ erro: "Nome do mangá é obrigatório" });
        }

        const nome = nomeManga.trim();

        const mangaExistente = await client.query(
            "SELECT * FROM manga WHERE LOWER(titulo) = LOWER($1)",
            [nome]
        );

        if (mangaExistente.rows.length > 0) {
            const manga = mangaExistente.rows[0];

            const volumes = await client.query(
                "SELECT numero_volume, capa_volume, isbn FROM volume_manga WHERE manga_id = $1 ORDER BY numero_volume",
                [manga.id]
            );

            const generos = await buscarGenerosDoManga(client, manga.id);

            return res.status(200).json({
                origem: "banco",
                manga: { ...manga, volumes: volumes.rows, generos }
            });
        }

        const mangaScraped = await buscarMangaNoScraper(nome);

        const jaExiste = await client.query(
            "SELECT id FROM manga WHERE LOWER(titulo) = LOWER($1)",
            [mangaScraped.titulo]
        );

        let mangaSalvo;

        if (jaExiste.rows.length === 0) {
            await client.query("BEGIN");

            const insercaoManga = await client.query(
                `INSERT INTO manga (titulo, capa, autor, editora, demografia, quantidade_volumes)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [
                    mangaScraped.titulo,
                    mangaScraped.capa,
                    mangaScraped.autor,
                    mangaScraped.editora,
                    mangaScraped.demografia,
                    mangaScraped.quantidadeVolumes
                ]
            );

            mangaSalvo = insercaoManga.rows[0];

            for (const volume of mangaScraped.volumes) {
                await client.query(
                    `INSERT INTO volume_manga (manga_id, numero_volume, capa_volume, isbn)
                     VALUES ($1, $2, $3, $4)`,
                    [mangaSalvo.id, volume.numero, volume.capa, volume.isbn]
                );
            }

            for (const nomeGenero of mangaScraped.generos) {
                const generoId = await obterOuCriarGenero(client, nomeGenero);

                await client.query(
                    `INSERT INTO manga_generos (manga_id, genero_id)
                     VALUES ($1, $2)
                     ON CONFLICT DO NOTHING`,
                    [mangaSalvo.id, generoId]
                );
            }

            await client.query("COMMIT");
        } else {
            mangaSalvo = { id: jaExiste.rows[0].id, ...mangaScraped };
        }

        return res.status(200).json({
            origem: "scraping",
            manga: { ...mangaSalvo, volumes: mangaScraped.volumes, generos: mangaScraped.generos }
        });
    } catch (erro) {
        await client.query("ROLLBACK").catch(() => { });
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao pesquisar Mangá" });
    } finally {
        client.release();
    }
};

export const explorarMangas = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const resultado = await client.query(
            "SELECT * FROM manga"
        );

        return res.status(200).json(resultado.rows);

    } catch (erro) {
        return res.status(500).json({
            erro: "Erro ao carregar exploração."
        });
    } finally {
        client.release();
    }
};