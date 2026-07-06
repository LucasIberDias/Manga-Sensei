import { Request, Response } from "express";
import { pool } from "../config/database";

export const pesquisarManga = async (
    req: Request,
    res: Response
) => {
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

        const volumesComErro: { numero: any; motivo: string }[] = [];

        for (const volume of manga.volumes) {
            try {
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
                    ON CONFLICT (manga_id, numero_volume) DO NOTHING
                    `,
                    [
                        mangaSalvo.id,
                        volume.numero,
                        volume.isbn,
                        volume.capa
                    ]
                );
            } catch (erroVolume: any) {
                console.error(
                    `Erro ao salvar volume ${volume.numero}:`,
                    erroVolume.message
                );
                volumesComErro.push({
                    numero: volume.numero,
                    motivo: erroVolume.message
                });
            }
        }

        return res.status(201).json({
            message: "Manga salvo com sucesso",
            id: mangaSalvo.id,
            volumesComErro
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao salvar manga"
        });
    }
};