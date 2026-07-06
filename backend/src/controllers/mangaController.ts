import { Request, Response } from "express";
import { pool } from "../config/database";
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
    volumes: VolumeScraped[];
    erro?: string;
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

export const pesquisarManga = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { nomeManga } = req.body;

        if (!nomeManga || typeof nomeManga !== "string" || !nomeManga.trim()) {
            return res.status(400).json({ erro: "Nome do mangá é obrigatório" });
        }

        const nome = nomeManga.trim();

        const mangaExistente = await client.query(
            "SELECT * FROM mangas WHERE LOWER(titulo) = LOWER($1)",
            [nome]
        );

        if (mangaExistente.rows.length > 0) {
            const manga = mangaExistente.rows[0];
            const volumes = await client.query(
                "SELECT numero, capa, isbn FROM volumes WHERE manga_id = $1 ORDER BY numero",
                [manga.id]
            );

            return res.status(200).json({
                origem: "banco",
                manga: { ...manga, volumes: volumes.rows }
            });
        }

        const mangaScraped = await buscarMangaNoScraper(nome);

        const jaExiste = await client.query(
            "SELECT id FROM mangas WHERE LOWER(titulo) = LOWER($1)",
            [mangaScraped.titulo]
        );

        let mangaSalvo;

        if (jaExiste.rows.length === 0) {
            await client.query("BEGIN");

            const insercaoManga = await client.query(
                `INSERT INTO mangas (titulo, capa, autor, editora, demografia, quantidade_volumes)
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
                    `INSERT INTO volumes (manga_id, numero, capa, isbn)
                     VALUES ($1, $2, $3, $4)`,
                    [mangaSalvo.id, volume.numero, volume.capa, volume.isbn]
                );
            }

            await client.query("COMMIT");
        } else {
            mangaSalvo = { id: jaExiste.rows[0].id, ...mangaScraped };
        }

        return res.status(200).json({
            origem: "scraping",
            manga: { ...mangaSalvo, volumes: mangaScraped.volumes }
        });
    } catch (erro) {
        await client.query("ROLLBACK").catch(() => {});
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao pesquisar Mangá" });
    } finally {
        client.release();
    }
};