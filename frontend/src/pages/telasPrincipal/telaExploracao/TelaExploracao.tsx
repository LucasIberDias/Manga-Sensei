import { useState } from "react";
import "./TelaExploracao.css";
import { FaBarcode } from "react-icons/fa6";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";
import Button from "../../../components/Buttons/Button";
import CategoriaManga from "./../../../components/CategoriaManga/CategoriaManga";

export default function Exploracao() {

    const [pesquisa, setPesquisa] = useState("");

    const mangasTeste = [
        {
            id: 1,
            titulo: "One Piece",
            capa: "https://m.media-amazon.com/images/I/81hY6m9jJ4L.jpg",
            quantidadeVolumes: 111,
        },
        {
            id: 2,
            titulo: "Blue Lock",
            capa: "https://m.media-amazon.com/images/I/81TF6fGxQJL.jpg",
            quantidadeVolumes: 34,
        },
        {
            id: 3,
            titulo: "Sense Life",
            capa: "https://m.media-amazon.com/images/I/81H+8VfQJML.jpg",
            quantidadeVolumes: 2,
        },
        {
            id: 4,
            titulo: "Betger",
            capa: "https://m.media-amazon.com/images/I/81TF6fGxQJL.jpg",
            quantidadeVolumes: 2,
        },
        {
            id: 5,
            titulo: "Atelier of Witch Hat",
            capa: "https://m.media-amazon.com/images/I/91s0B6d9S-L.jpg",
            quantidadeVolumes: 13,
        },
        {
            id: 6,
            titulo: "Naruto",
            capa: "https://m.media-amazon.com/images/I/81lN7Jm1V-L.jpg",
            quantidadeVolumes: 72,
        },
    ];

    return (
        <div className="exploracao-page">

            <MenuNavegacao />

            <div className="conteudo-exploracao">

                <div className="itens-superior">

                    <div className="cabecalho">

                        <div>
                            <h1>Exploração</h1>

                            <p>
                                Descubra novos mangás para aumentar sua coleção!
                            </p>
                        </div>

                        <div className="acoes-superior">

                            <Button
                                texto="Escanear ISBN"
                                cor="terciaria"
                                tipo="button"
                                Icon={FaBarcode}
                            />

                            <InputPesquisa
                                value={pesquisa}
                                onChange={setPesquisa}
                            />

                        </div>

                    </div>

                </div>

                <CategoriaManga
                    titulo="Shounen"
                    mangas={mangasTeste}
                />

                <CategoriaManga
                    titulo="Seinen"
                    mangas={mangasTeste}
                />

                <CategoriaManga
                    titulo="Romance"
                    mangas={mangasTeste}
                />

                <CategoriaManga
                    titulo="Fantasia"
                    mangas={mangasTeste}
                />

            </div>

        </div>
    );
}