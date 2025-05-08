import { Link } from 'react-router-dom';
const Button = ({ text, link }) => {
    if (link) {
        return (
            <button
                type='submit'
                className='w-full text-center bg-americanOrange-500 text-white py-2 rounded-md hover:bg-americanOrange-600'
            >
                <Link to={link}>{text}</Link>
            </button>
        );
    }

    return (
        <button
            type='submit'
            className='w-full bg-americanOrange-500 text-white py-2 rounded-full hover:bg-americanOrange-600'
        >
            {text}
        </button>
    );
};

export default Button;
