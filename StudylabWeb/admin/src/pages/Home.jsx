import InfoCards from '../components/InfoCards/InfoCards';

const Home = () => {
    return (
        <div className='w-full h-full text-gray-700'>
            <InfoCards />
            <div className='flex gap-4 mt-6'>
                <section className='flex-grow-[2] grid grid-cols-4 place-items-center p-10 gap-12 rounded-xl bg-white'>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                    <div className='bg-gray-300 w-full h-24'></div>
                </section>
                <aside className='flex-grow rounded-xl bg-white'></aside>
            </div>
        </div>
    );
};

export default Home;
