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
    const [topicoFilter, setTopicoFilter] = useState(0);
    const [selectedTopicos, setSelectedTopicos] = useState([]);
    const [conteudo, setConteudo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0); // força re-fetch da tabela

    // Busca disciplinas apenas uma vez na montagem
    useEffect(() => {
        const loadDisciplinas = async () => {
            try {
                const list = await getAllDisciplinas();
                setSelectDisciplinas([
                    { value: 0, label: "Todas as disciplinas" },
                    ...list.map(t => ({
                        value: t.idDisciplina,
                        label: t.nomeDisciplina
                    }))
                ]);
            } catch (error) {
                console.error('Erro ao carregar disciplinas:', error);
            }
        };
        loadDisciplinas();
    }, []);

    // Busca tópicos apenas quando a disciplina muda
    useEffect(() => {
        const loadTopicos = async () => {
            try {
                const list = disciplinaFilter
                    ? await getAllTopicosDisciplinaByDisciplina(disciplinaFilter)
                    : await getAllTopicosDisciplina();

                setSelectedTopicos([
                    { value: 0, label: "Todos os tópicos" },
                    ...list.map(t => ({
                        value: t.idTopico,
                        label: t.nomeTopico
                    }))
                ]);
            } catch (error) {
                console.error('Erro ao carregar tópicos:', error);
            }
        };
        loadTopicos();
    }, [disciplinaFilter]);

    // Busca materiais quando filtros, página ou refreshKey mudam
    useEffect(() => {
        const loadMateriais = async () => {
            try {
                const idDisciplina = disciplinaFilter || 0;
                const idTopico = !disciplinaFilter || !topicoFilter ? 0 : topicoFilter;

                const conteudoList = await getMaterialByDisciplinaOrTopico(
                    currentPage,
                    10,
                    idDisciplina,
                    idTopico
                );

                setConteudo(conteudoList);
                setHasData(conteudoList.documentoForumCount > 0);

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
        loadMateriais();
    }, [currentPage, disciplinaFilter, topicoFilter, refreshKey]);

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
                            setTopicoFilter={setTopicoFilter}
                            disciplinas={selectDisciplinas}
                            setCurrentPage={setCurrentPage}
                        />

                        {disciplinaFilter !== '' && disciplinaFilter !== 0 && (
                            <FilterTopic
                                setTopicoFilter={setTopicoFilter}
                                topicos={selectedTopicos}
                                setCurrentPage={setCurrentPage}
                                topicoFilter={topicoFilter}
                            />
                        )}
                    </div>
                </div>

                <div className="min-h-0 overflow-hidden">
                    <TableMaterialsReadOnly
                        data={conteudo}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setRefreshKey}
                        hasData={hasData}
                    />
                </div>
            </section>
        </div>
    );
};

export default Materials;