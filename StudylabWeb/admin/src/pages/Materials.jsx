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
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getAllConteudos = async () => {
            try {
                let conteudoList = await getMaterialByDisciplinaOrTopico(currentPage,10, 0,0);
                setConteudo(conteudoList);                    
            } catch (error) {
                console.log(error);            
            }
        }
        getAllConteudos();
    }, [currentPage]);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='rounded-xl bg-white px-4 '>
                <div className='flex items-center justify-between px-4 py-4'>
                    {/* Título e filtro */}
                    <div className='flex items-center gap-4'>
                        <h1 className='text-3xl font-bold'>Conteúdos</h1>
                        <Filter data={conteudo.documentos} />
                    </div>

                    {/* Botão alinhado à direita */}
                    <Button
                        text={'Cadastrar Conteúdo'}
                        handleClick={() => setShowRegister(true)}
                    />
                </div>

                <TableMaterials
                    data={conteudo}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleDelete={removeItem}
                />

                {showRegister && (
                    <RegisterMaterial handleCancel={() => setShowRegister(false)} />
                )}
            </section>

        </div>
    );
};

export default Materials;
