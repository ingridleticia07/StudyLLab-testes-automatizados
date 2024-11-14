const Button = ({ text, handleClick }) => {
    return (
        <button
            onClick={handleClick}
            className='px-5 py-4 text-lg font-medium tracking-wider rounded-lg bg-americanOrange-500 text-white hover:bg-americanOrange-600'
        >
            {text}
        </button>
    );
};

export default Button;
