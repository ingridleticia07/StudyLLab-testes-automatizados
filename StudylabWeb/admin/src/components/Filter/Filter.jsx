import { useState } from 'react';
import { icons } from '../../assets/assets';

const Filter = ({data}) => {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <div className='relative inline-flex'>
            <button
                disabled={!data}
                onClick={() => setShowOptions(!showOptions)}
                aria-label='filtro'
                className='flex h-12 items-center gap-4 font-bold bg-white text-gray-800 text-xl border-2 rounded-lg px-4 py-6 shadow-md disabled:bg-gray-200 disabled:opacity-90'
            >
                <img src={icons.filter} alt='Filtro' />
                Filtro
            </button>
            {showOptions && (
                <div className='flex flex-col absolute z-50 left-full w-36 p-2 font-medium  bg-white text-gray-600 text-lg border-2 rounded-lg'>
                    <button className='flex items-center justify-between'>
                        <p>Conteudo</p>
                        <img src={icons.arrowRight} alt="" />
                    </button>
                    <button className='flex items-center justify-between'>
                        <p>Data</p>
                        <img src={icons.arrowRight} alt="" />
                    </button>
                    <button className='flex items-center justify-between'>
                        <p>Status</p>
                        <img src={icons.arrowRight} alt="" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Filter;
