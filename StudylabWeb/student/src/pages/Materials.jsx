import {useEffect,useState } from 'react';
import Button from '../components/Buttons/Button';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterials from '../components/Tables/TableMaterials';
import SubjectFilter from '../components/Filter/FilterSubject';
import RegisterMaterial from '../components/RegisterMaterial/RegisterMaterial';
import { getMaterialByDisciplinaOrTopico } from "../../../platform/repository/material";
import { getAllDisciplinas } from "../../../platform/repository/disciplina";
import FilterTopic from '../components/Filter/FilterTopic';
import { getAllTopicosDisciplina, getAllTopicosDisciplinaByDisciplina } from "../../../platform/repository/topico";

const Materials = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [ hasData, SetHasData ] = useState(true);
    const [disciplinaFilter, setDisciplinaFilter] = useState('');
    const [selectDisciplinas, setSelectDisciplinas] = useState([]);
    const [topicoFilter, setTopicoFilter] = useState('');
    const [selectedTopicos, setSelectedTopicos] = useState([]);
    const [conteudo, setConteudo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);

    useEffect(() => {
        const getAllConteudos = async () => {
            try {
                const idDisciplina = disciplinaFilter || 0;
                const idTopico = topicoFilter || 0;
                let currentPageFilter = currentPage || 1;
                
                let conteudoList = await getMaterialByDisciplinaOrTopico(currentPage,10, idDisciplina,idTopico);
                setConteudo(conteudoList);

                if(conteudoList.documentoForumCount == 0)
                    SetHasData(false);
                else
                    SetHasData(true);
                
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
                
                let topicoList;
                
                if(disciplinaFilter!='')
                    topicoList = await getAllTopicosDisciplinaByDisciplina(disciplinaFilter);
                else 
                    topicoList = await getAllTopicosDisciplina();
                
                let optionsTopico = [

                    {
                        value:0,
                        label:"Todas os tópicos"
                    },
                    ...topicoList.map(t => ({
                        value: t.idTopico,
                        label: t.nomeTopico
                    })),
                ];
                setSelectedTopicos(optionsTopico);

                setConteudo(conteudoList);
            } catch (error) {
                console.log(error);            
            }
        }
        getAllConteudos();
    }, [currentPage, disciplinaFilter, iterationData, topicoFilter]);

    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Conteúdos' />
            <section className='rounded-xl bg-white px-4'>
                <div className="flex flex-col lg:flex-row lg:flex-wrap items-center gap-2 px-0 lg:px-2 py-4">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 w-full lg:w-auto mb-2 lg:mb-0">
                        <h1 className="text-3xl font-bold">Conteúdos</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                                {/* SubjectFilter com 100% em mobile */}
                                <div className="w-full sm:w-auto">
                                    <SubjectFilter setDisciplinaFilter={setDisciplinaFilter} disciplinas={selectDisciplinas} setCurrentPage={setCurrentPage}/>
                                </div>
                                
                                {/* FilterTopic com 100% em mobile */}
                                {
                                    disciplinaFilter!=='' && (
                                        <div className="w-full sm:w-auto">
                                            <FilterTopic setTopicoFilter={setTopicoFilter} topicos={selectedTopicos} setCurrentPage={setCurrentPage}/>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex lg:flex-grow lg:justify-end">
                        <Button
                            text={'Cadastrar Conteúdo'}
                            handleClick={() => setShowRegister(true)}
                            className="w-full lg:w-auto"
                        />
                    </div>
                </div>

                <TableMaterials
                    data={conteudo}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setIterationData={setIterationData}
                    hasData={hasData}
                />

                {showRegister && (
                    <RegisterMaterial handleCancel={() => setShowRegister(false)} selectedTopicos={selectedTopicos} setCurrentPage={setCurrentPage} setIterationData={setIterationData}/>
                )}
            </section>

        </div>
    );
};

export default Materials;
