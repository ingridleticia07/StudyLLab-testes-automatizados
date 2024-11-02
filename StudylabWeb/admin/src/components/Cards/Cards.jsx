const Cards = ({ image, text = 'amount', number = 0, division = true }) => {
    return (
        <div className=' flex items-center justify-center py-3 '>
            <div className='w-16 h-16 mr-3 bg-gray-400 rounded-full'>
                {image && (
                    <img
                        src={image}
                        alt='imagem do card'
                        className='rounded-full'
                    />
                )}
            </div>

            <div>
                <p className='text-sm mb-2'>{text}</p>
                <p className='text-xl font-bold'>{number}</p>
            </div>
            {division && (
                <hr className='h-20 ml-10 w-px bg-gray-300 border-none' />
            )}
        </div>
    );
};

export default Cards;
