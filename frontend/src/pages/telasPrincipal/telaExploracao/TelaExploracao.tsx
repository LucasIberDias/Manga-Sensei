import "./TelaExploracao.css";
import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";


export default function Exploracao() {
    return (
        <div className="exploracao-page">
            <MenuNavegacao />

            <div className="itens-superior">
                <h1>Exploração</h1>
                <p>Explore novos mundos e encontre seu próximo mangá favorito.</p>


            </div>
        </div>
    );
}