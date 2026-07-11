import "./CardExploracao.css";

type Manga = {
    id: number;
    titulo: string;
    capa: string;
    quantidadeVolumes: number;
};

type CardMangaProps = {
    manga: Manga;
};

export default function CardManga({ manga }: CardMangaProps) {
    return (
        <div className="card-manga">

            <img
                src={manga.capa}
                alt={manga.titulo}
                className="card-manga-capa"
            />

            <div className="card-manga-volumes">
                Vol. {manga.quantidadeVolumes}
            </div>

            <h3 className="card-manga-titulo">
                {manga.titulo}
            </h3>

        </div>
    );
}