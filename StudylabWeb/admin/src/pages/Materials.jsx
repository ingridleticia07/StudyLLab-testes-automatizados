import { useEffect, useState } from 'react';
import { icons } from '../assets/assets';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';

// dados fakes para teste
import { conteudos } from '../data/dataFake';

const Materials = () => {
    // time para carregamento dos dados na tabela
    const [data, setData] = useState(null);

    const loadDenucias = () => {
        setTimeout(() => {
            setData(conteudos);
        }, 300);
    };

    useEffect(() => {
        loadDenucias();
    });

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='flex flex-col h-full min-h-[450px] px-3 mb-4 bg-white rounded-lg '>
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Conteúdos</h1>
                    <button
                        disabled={!data}
                        aria-label='filtro'
                        className='flex h-12 items-center gap-4 font-bold text-gray-800 text-xl border-2 rounded-lg px-4 py-6 shadow-md disabled:bg-gray-200 disabled:opacity-90'
                    >
                        <img src={icons.filter} alt='Filtro' />
                        Filtro
                    </button>
                </div>
                <TableMaterials data={data} />
            </section>
        </div>
    );
};

export default Materials;
