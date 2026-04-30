const Cards = ({ image, text = 'amount', number = 0, division = true, icon }) => {
    return (
        <div className=' flex items-center justify-center py-3 '>
            <div className='w-16 h-16 mr-3 bg-orange-100 rounded-full'>
                {icon && (
                    <div className=" flex items-center justify-center w-full h-full">
                        {icon}
                    </div>
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
