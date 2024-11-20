const AuthHeader = ({ infoText }) => {
    return (
        <header className='text-center'>
            <h1 className='text-americanOrange-500 text-center text-4xl font-urbanist '>
                Study
                <span className='font-bold'>Lab</span>
            </h1>
            <h2 className='text-xl font-bold text-center text-gray-800 my-6'>
                {infoText}
            </h2>
        </header>
    );
};

export default AuthHeader;
