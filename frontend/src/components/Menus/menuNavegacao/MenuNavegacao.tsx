import { FaHouseUser } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { SiWpexplorer } from "react-icons/si";
import { SiGooglesheets } from "react-icons/si";
import { IoExit } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import Logo from "../../Logo";
import LinkNavegacao from "../../Links/LinkNavegacao";
import "./MenuNavegacao.css";


export default function menuNavegacao() {
    return (
        <div className="menu">
            <Logo />

            <div className="links">
                <LinkNavegacao destino="inicio" texto="Inicio" Icon={FaHouseUser} />
                <LinkNavegacao destino="colecao" texto="Coleção" Icon={FaBookOpen} />
                <LinkNavegacao destino="exploracao" texto="Exploração" Icon={SiWpexplorer} />
                <LinkNavegacao destino="marketplace" texto="Marketplace" Icon={FaShop} />
                <LinkNavegacao destino="relatorios" texto="Relatórios" Icon={SiGooglesheets} />
                <LinkNavegacao destino="configuracoes" texto="Configurações" Icon={IoMdSettings} />
            </div>

            <div className="perfil">
                <img src={""} alt="Foto do usuário" />

                <div className="perfil-info">
                    <p>Usuário</p>
                    <LinkNavegacao destino="perfil" texto="Ver perfil >" />
                </div>
            </div>

            <div className="sair">
                <LinkNavegacao destino="/" texto="Sair" Icon={IoExit} />
            </div>
        </div>
    );
}