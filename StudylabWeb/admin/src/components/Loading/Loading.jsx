const Loading = () => {
    return (
        <div className='flex items-center justify-center absolute inset-0 bg-white bg-opacity-80'>
            <div className='w-12 h-12 border-8 border-t-transparent border-l-transparent border-gray-500 rounded-full animate-spin'></div>
        </div>
    );
};

export default Loading;
