const AuthHeader = ({ infoText, color= 'text-americanOrange-500' }) => {
    return (
        <header className='text-center'>
            <h1 className={`text-center text-4xl font-urbanist ${color}`}>
                Study
                <span className='font-bold'>Lab</span>
            </h1>
            <h2 className='text-lg font-bold text-center text-gray-600 my-6'>
                {infoText}
            </h2>
        </header>
    );
};

export default AuthHeader;
