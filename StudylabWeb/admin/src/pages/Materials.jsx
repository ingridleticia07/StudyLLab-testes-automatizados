import { useContext } from 'react';
import { StudylabContext } from '../context/StudylabContext';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import Filter from '../components/Filter/Filter';

const Materials = () => {
    const { data, removeItem } = useContext(StudylabContext);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='flex flex-col h-full min-h-[450px] px-3 mb-4 bg-white rounded-lg '>
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Conteúdos</h1>
                    <Filter data={data.conteudos} />
                </div>
                <TableMaterials data={data.conteudos} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Materials;
