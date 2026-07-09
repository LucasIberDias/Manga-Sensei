import "./Button.css";

type ButtonProps = {
    tipo: "submit" | "reset" | "button";
    texto: string;
    cor: "primaria" | "secundaria";
    onClick?: () => void;
};

export default function Button(props: ButtonProps) {
    return (
        <button 
            className={`button ${props.cor}`} 
            type={props.tipo} 
            onClick={props.onClick}> 
            {props.texto} 
        </button>
    );
}