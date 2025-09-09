import {useEffect,useState } from 'react';
import Button from '../components/Buttons/Button';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import SubjectFilter from '../components/Filter/FilterSubject';
import RegisterMaterial from '../components/RegisterMaterial/RegisterMaterial';
import { getMaterialByDisciplinaOrTopico } from "../../../platform/repository/material";
import { getAllDisciplinas } from "../../../platform/repository/disciplina";

const Materials = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [disciplinaFilter, setDisciplinaFilter] = useState('');
    const [selectDisciplinas, setSelectDisciplinas] = useState([]);
    const [conteudo, setConteudo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);

    useEffect(() => {
        const getAllConteudos = async () => {
            try {
                const idDisciplina = disciplinaFilter || 0;
                let currentPageFilter = currentPage || 1;
                
                let conteudoList = await getMaterialByDisciplinaOrTopico(currentPage,10, idDisciplina,0);
                setConteudo(conteudoList);

                let selectDisciplinas = await getAllDisciplinas();
                let options = [

                    {
                        value:0,
                        label:"Todas as disciplinas"
                    },
                    ...selectDisciplinas.map(t => ({
                        value: t.idDisciplina,
                        label: t.nomeDisciplina
                    })),
                ];
                setSelectDisciplinas(options);                    
            } catch (error) {
                console.log(error);            
            }
        }
        getAllConteudos();
    }, [currentPage, disciplinaFilter, iterationData]);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='rounded-xl bg-white px-4 '>
                <div className="flex flex-wrap items-center gap-2 px-4 py-4">
                    
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className="text-3xl font-bold">Conteúdos</h1>
                        <SubjectFilter setDisciplinaFilter={setDisciplinaFilter} disciplinas={selectDisciplinas} setCurrentPage={setCurrentPage}/>
                    </div>

                    <div className="flex-grow flex justify-end">
                        <Button
                        text={'Cadastrar Conteúdo'}
                        handleClick={() => setShowRegister(true)}
                        />
                    </div>
                </div>

                <TableMaterials
                    data={conteudo}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setIterationData={setIterationData}
                />

                {showRegister && (
                    <RegisterMaterial handleCancel={() => setShowRegister(false)} />
                )}
            </section>

        </div>
    );
};

export default Materials;
