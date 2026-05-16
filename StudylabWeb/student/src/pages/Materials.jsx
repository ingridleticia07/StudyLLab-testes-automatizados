import { useState, useEffect } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableMaterialsReadOnly from '../components/Tables/TableMaterials';
import SubjectFilter from '../components/Filter/FilterSubject';
import FilterTopic from '../components/Filter/FilterTopic';

import { getMaterialByDisciplinaOrTopico } from "../../../platform/repository/material";
import { getAllDisciplinas } from "../../../platform/repository/disciplina";
import { getAllTopicosDisciplina, getAllTopicosDisciplinaByDisciplina } from "../../../platform/repository/topico";

const Materials = () => {
    const [hasData, setHasData] = useState(true);
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
                const idTopico = disciplinaFilter === 0 || !topicoFilter ? 0 : topicoFilter;
                
                let currentPageFilter = currentPage || 1;

                let conteudoList = await getMaterialByDisciplinaOrTopico(
                    currentPageFilter,
                    10,
                    idDisciplina,
                    idTopico
                );

                setConteudo(conteudoList);
                setHasData(conteudoList.documentoForumCount > 0);

                let selectDisciplinas = await getAllDisciplinas();
                let options = [
                    {
                        value: 0,
                        label: "Todas as disciplinas"
                    },
                    ...selectDisciplinas.map(t => ({
                        value: t.idDisciplina,
                        label: t.nomeDisciplina
                    }))
                ];
                setSelectDisciplinas(options);

                let topicoList;

                if (disciplinaFilter && disciplinaFilter !== '') {
                    topicoList = await getAllTopicosDisciplinaByDisciplina(disciplinaFilter);
                } else {
                    topicoList = await getAllTopicosDisciplina();
                }

                let optionsTopico = [
                    {
                        value: 0,
                        label: "Todos os tópicos"
                    },
                    ...topicoList.map(t => ({
                        value: t.idTopico,
                        label: t.nomeTopico
                    }))
                ];
                setSelectedTopicos(optionsTopico);

                if (
                    conteudoList.maxPage &&
                    currentPage > conteudoList.maxPage &&
                    conteudoList.maxPage > 0
                ) {
                    setCurrentPage(conteudoList.maxPage);
                }

            } catch (error) {
                console.error('Erro ao carregar conteúdos:', error);
                setHasData(false);
            }
        };

        getAllConteudos();
    }, [currentPage, disciplinaFilter, iterationData, topicoFilter]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Breadcrumb page="Conteúdos" />

            <section className="flex flex-col bg-white rounded-xl p-4 max-h-full overflow-hidden min-h-0">

                <div className="flex flex-col gap-4 mb-4 shrink-0">
                    <h1 className="text-3xl font-bold">
                        Conteúdos
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <SubjectFilter
                            setDisciplinaFilter={setDisciplinaFilter}
                            disciplinas={selectDisciplinas}
                            setCurrentPage={setCurrentPage}
                        />

                        {disciplinaFilter !== '' && disciplinaFilter !== 0 && (
                            <FilterTopic
                                setTopicoFilter={setTopicoFilter}
                                topicos={selectedTopicos}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                </div>

                <div className="min-h-0 overflow-hidden">
                    <TableMaterialsReadOnly
                        data={conteudo}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setIterationData}
                        hasData={hasData}
                    />
                </div>
            </section>
        </div>
    );
};

export default Materials;