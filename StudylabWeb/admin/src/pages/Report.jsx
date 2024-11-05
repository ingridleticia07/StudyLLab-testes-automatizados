import { useEffect, useState } from 'react';
import { icons } from '../assets/assets';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableReport from '../components/Tables/TableReport';

// dados fakes para teste
import { denuncias } from '../data/dataFake';

const Report = () => {
    // time para carregamento dos dados na tabela
    const [data, setData] = useState(null);

    const loadDenucias = () => {
        setTimeout(() => {
            setData(denuncias);
        }, 300);
    };

    useEffect(() => {
        loadDenucias();
    });

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page={'Denúncias'} />
            <section className='flex flex-col h-full mb-4 min-h-[450px] px-3 bg-white rounded-lg'>
                <div className='flex items-center justify-between'>
                    <h1 className='py-8 text-3xl font-bold'>Denúncias</h1>
                    <button
                        disabled={!data}
                        aria-label='filtro'
                        className='flex items-center h-12 gap-4 px-4 py-6 mr-4 font-bold text-gray-800 text-xl border-2 rounded-lg shadow-md'
                    >
                        <img src={icons.filter} alt='Filtro' />
                        <p>Filtro</p>
                    </button>
                </div>
                <TableReport data={data} />
            </section>
        </div>
    );
};

export default Report;
