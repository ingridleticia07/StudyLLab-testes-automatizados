import { useEffect, useState } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import Filter from '../components/Filter/Filter';

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
                    <Filter data={data}/>
                </div>
                <TableMaterials data={data} />
            </section>
        </div>
    );
};

export default Materials;
