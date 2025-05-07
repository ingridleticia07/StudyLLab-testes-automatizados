import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Button from '../components/Buttons/Button';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import Filter from '../components/Filter/Filter';
import RegisterMaterial from '../components/RegisterMaterial/RegisterMaterial';
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
            <section className='rounded-xl bg-white px-4'>
                <div className='flex items-center justify-between px-6 py-6'>
                    <h1 className='text-3xl font-bold'></h1>
                    <Button
                        text={'Cadastrar Conteúdo'}
                        handleClick={() => setShowRegister(true)}
                    />
                </div>
            </section>
            <section className='flex flex-col h-full min-h-[450px] px-3 mb-4 bg-white rounded-lg '>
                <div className='flex items-center gap-x-10'>
                    <h1 className='py-8 text-3xl font-bold'>Conteúdos</h1>
                    <Filter data={conteudo.documentos} />
                </div>
                <TableMaterials data={conteudo} handleDelete={removeItem} />
            </section>
            {showRegister && (
                <RegisterMaterial handleCancel={() => setShowRegister(false)} />
            )}
        </div>
    );
};

export default Materials;
