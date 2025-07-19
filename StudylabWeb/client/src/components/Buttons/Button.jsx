import { Link } from 'react-router-dom';

const Button = ({ text, link, onClick, type = 'button' }) => {
    if (link) {
        return (
            <Link
                to={link}
                className='min-w-[30rem] w-full text-center bg-americanOrange-500 text-white py-2 rounded-full hover:bg-americanOrange-600 block'
            >
                {text}
            </Link>
        );
    }

    return (
        <button
            type='submit'
            className='min-w-[30rem] w-full bg-americanOrange-500 text-white py-2 rounded-lg hover:bg-americanOrange-600'
        >
            {text}
        </button>
    );
};

export default Button;
