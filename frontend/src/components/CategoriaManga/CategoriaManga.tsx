import "./CategoriaManga.css";
import { FaChevronRight } from "react-icons/fa";

import CardExploracao from "./../Cards/CardExploracao/CardExploracao";

type Manga = {
    id: number;
    titulo: string;
    capa: string;
    quantidadeVolumes: number;
};

type CategoriaMangaProps = {
    titulo: string;
    mangas: Manga[];
};

export default function CategoriaManga({
    titulo,
    mangas,
}: CategoriaMangaProps) {
    return (
        <section className="categoria-manga">

            <h2>{titulo}</h2>

            <div className="categoria-conteudo">

                <div className="categoria-cards">

                    {mangas.map((manga) => (
                        <CardExploracao
                            key={manga.id}
                            manga={manga}
                        />
                    ))}

                </div>

                <button className="botao-proximo">
                    <FaChevronRight />
                </button>

            </div>

        </section>
    );
}