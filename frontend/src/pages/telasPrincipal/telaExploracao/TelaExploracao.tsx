import { useEffect, useState } from "react";
import "./TelaExploracao.css";
import { FaBarcode } from "react-icons/fa6";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";
import InputPesquisa from "../../../components/Inputs/InputPesquisa";
import Button from "../../../components/Buttons/Button";

export default function Exploracao() {
    const [pesquisa, setPesquisa] = useState("");
    const [manga, setManga] = useState<any>(null);

    const pesquisarManga = async (nome: string) => {
        console.log("Pesquisando:", nome);

        if (!nome.trim()) {
            setManga(null);
            return;
        }

        try {
            const resposta = await fetch(
                "http://localhost:3000/pesquisarManga",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nomeManga: nome,
                    }),
                }
            );

            console.log("Status resposta:", resposta.status);

            if (!resposta.ok) {
                const erro = await resposta.text();
                console.log("Erro servidor:", erro);
                return;
            }

            const dados = await resposta.json();

            console.log("Dados recebidos:", dados);

            setManga(dados.manga);

        } catch (erro) {
            console.log("Erro na pesquisa:", erro);
        }
    };


    useEffect(() => {
        console.log("Input mudou:", pesquisa);

        if (pesquisa.trim().length < 3) {
            setManga(null);
            return;
        }

        const timer = setTimeout(() => {
            pesquisarManga(pesquisa);
        }, 500);


        return () => clearTimeout(timer);

    }, [pesquisa]);


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
                        />

                    </div>

                </div>


                <p>
                    Explore novos mundos e encontre seu próximo mangá favorito.
                </p>

            </div>


            {manga && (

                <div className="resultado-pesquisa">

                    {manga.capa && (
                        <img
                            src={manga.capa}
                            alt={manga.titulo}
                        />
                    )}


                    <div>

                        <h2>{manga.titulo}</h2>

                        <p>
                            <strong>Autor:</strong> {manga.autor}
                        </p>

                        <p>
                            <strong>Editora:</strong> {manga.editora}
                        </p>

                        <p>
                            <strong>Demografia:</strong> {manga.demografia}
                        </p>

                        <p>
                            <strong>Volumes:</strong> {manga.quantidade_volumes}
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
}