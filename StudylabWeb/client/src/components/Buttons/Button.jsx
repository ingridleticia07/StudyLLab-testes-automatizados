import { Link } from 'react-router-dom';

const Button = ({ text, link, onClick, type = 'button', disabled = false }) => {
    if (link) {
        return (
            <Link
                to={disabled ? '#' : link}
                onClick={disabled ? (e) => e.preventDefault() : onClick}
                className={`block w-full text-center bg-americanOrange-500 text-white py-2 rounded-lg 
                    ${disabled 
                        ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'hover:bg-americanOrange-600'
                    }`}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full text-center bg-americanOrange-500 text-white py-2 rounded-lg 
                ${disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-americanOrange-600'
                }`}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default Button;