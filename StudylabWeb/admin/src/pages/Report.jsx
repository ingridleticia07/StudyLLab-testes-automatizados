import { useContext } from 'react';
import { StudylabContext } from '../context/StudylabContext';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableReport from '../components/Tables/TableReport';
import Filter from '../components/Filter/Filter';

const Report = () => {
    const { data, removeItem } = useContext(StudylabContext);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page={'Denúncias'} />
            <section className='flex flex-col h-full mb-4 min-h-[450px] px-3 bg-white rounded-lg'>
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Denúncias</h1>
                    <Filter data={data.denuncias} />
                </div>
                <TableReport data={data.denuncias} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Report;
