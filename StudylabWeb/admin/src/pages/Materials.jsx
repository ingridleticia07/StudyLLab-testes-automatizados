import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import Filter from '../components/Filter/Filter';
import { getMaterialByDisciplinaOrTopico } from "../../../platform/repository/material";

const Materials = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [conteudo, setConteudo] = useState([]);

    useEffect(() => {
            const getAllConteudos = async () => {
                try {
                    let conteudoList = await getMaterialByDisciplinaOrTopico(1,10, 0,0);
                    setConteudo(conteudoList);                    
                } catch (error) {
                    console.log(error);            
                }
            }
            getAllConteudos();
        }, []);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='flex flex-col h-full min-h-[450px] px-3 mb-4 bg-white rounded-lg '>
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Conteúdos</h1>
                    <Filter data={conteudo.documentos} />
                </div>
                <TableMaterials data={conteudo} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Materials;
