import "./CardExploracao.css";

type CardExploracaoProps = {
    titulo: string;
    capa: string;
    quantidadeVolumes: number;
};

export default function CardExploracao({
    titulo,
    capa,
    quantidadeVolumes,
}: CardExploracaoProps) {
    return (
        <div className="card-manga">

            <img
                src={capa}
                alt={titulo}
                className="card-manga-imagem"
            />

            <div className="card-manga-volumes">
                {quantidadeVolumes} Volumes
            </div>

            <h3 className="card-manga-titulo">
                {titulo}
            </h3>

        </div>
    );
}