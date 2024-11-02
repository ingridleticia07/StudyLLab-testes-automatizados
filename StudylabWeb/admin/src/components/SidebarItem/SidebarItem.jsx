import { Link } from 'react-router-dom';

const SidebarItem = ({
    link = '#',
    icon,
    alt = 'sidebar item icon',
    selected = false,
}) => {
    return (
        <li>
            <Link
                to={link}
                className={`flex items-center justify-center w-14 h-14 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                    selected
                        ? 'bg-americanOrange-500'
                        : 'hover:bg-americanOrange-200'
                }`}
            >
                {/* Mudar a tag img para outra para poder alterar a cor do icone quando estiver selecionado */}
                <img src={icon} alt={alt} />
            </Link>
        </li>
    );
};

export default SidebarItem;
