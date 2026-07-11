import { useState } from "react";
import "./TelaExploracao.css";
import { FaBarcode } from "react-icons/fa6";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";
import Button from "../../../components/Buttons/Button";

export default function Exploracao() {
    const [pesquisa, setPesquisa] = useState("");
    const [manga, setManga] = useState<any>(null);

    const pesquisarManga = async () => {
        if (!pesquisa.trim()) {
            setManga(null);
            return;
        }

        try {
            const resposta = await fetch("http://localhost:3000/pesquisarManga", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nomeManga: pesquisa,
                }),
            });

            if (!resposta.ok) {
                throw new Error("Erro ao pesquisar mangá.");
            }

            const dados = await resposta.json();
            setManga(dados.manga);

        } catch (erro) {
            console.error("Erro ao pesquisar:", erro);
        }
    };

    return (
        <div className="exploracao-page">

            <MenuNavegacao />

            <div className="itens-superior">

                <div className="cabecalho">

                    <h1>Exploração</h1>

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
                            onEnter={pesquisarManga}
                        />

                    </div>

                </div>

                <p>
                    Explore novos mundos e encontre seu próximo mangá favorito.
                </p>

                {manga && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>{manga.titulo}</h2>
                        <img
                            src={manga.capa}
                            alt={manga.titulo}
                            width={180}
                        />
                    </div>
                )}

            </div>

        </div>
    );
}