import { useEffect, useState } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableReport from '../components/Tables/TableReport';
import Filter from '../components/Filter/Filter';

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
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Denúncias</h1>
                    <Filter data={data}/>
                </div>
                <TableReport data={data} />
            </section>
        </div>
    );
};

export default Report;
