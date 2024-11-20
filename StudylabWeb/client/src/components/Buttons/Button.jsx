const Button = ({ text }) => {
    return (
        <button
            type='submit'
            className='w-full bg-americanOrange-500 text-white py-2 rounded-md hover:bg-americanOrange-600'
        >
            {text}
        </button>
    );
};

export default Button;
