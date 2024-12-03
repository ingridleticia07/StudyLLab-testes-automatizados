import { Link } from 'react-router-dom';

const NavLink = ({ to, text, login, cadastro, link }) => {
    return (
        <Link
            to={to}
            className={` 
                ${login ? 'text-americanOrange-500 py-4 px-4 hover:bg-americanOrange-100 hover:rounded-lg' : ''} 
                ${cadastro ? 'bg-americanOrange-100 text-americanOrange-500 py-4 px-4 rounded-full font-semibold hover:bg-americanOrange-500 hover:text-white' : ''} 
                ${link ? 'text-gray-600 px-4 py-2 hover:bg-gray-100 hover:rounded-lg' : ''}
              `}
        >
            {text}
        </Link>
    );
};

export default NavLink;