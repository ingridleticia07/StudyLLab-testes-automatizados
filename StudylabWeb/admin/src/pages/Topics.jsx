import { useState, useEffect } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableTopics from '../components/Tables/TableTopics';
import RegisterTopic from '../components/RegisterTopic/RegisterTopic';
import SubjectFilter from '../components/Filter/FilterSubject';

import { getAllTopicosDisciplinaWithPagination } from "../../../platform/repository/topico";
import { getAllDisciplinas } from "../../../platform/repository/disciplina";

const Topics = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [disciplinaFilter, setDisciplinaFilter] = useState('');
    const [topicos, setTopicos] = useState([]);
    const [selectDisciplinas, setSelectDisciplinas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        const getTopicosDisciplinas = async () => {
            try {
                const idDisciplina = disciplinaFilter || 0;
                let currentPageFilter = currentPage || 1;

                const topicosList = await getAllTopicosDisciplinaWithPagination(
                    currentPageFilter,
                    10,
                    idDisciplina
                );

                setTopicos(topicosList);
                setHasData(topicosList.topicoCount > 0);

                const selectDisciplinas = await getAllDisciplinas();
                const options = [
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

                if (
                    topicosList.maxPage &&
                    currentPage > topicosList.maxPage &&
                    topicosList.maxPage > 0
                ) {
                    setCurrentPage(topicosList.maxPage);
                }

            } catch (error) {
                console.error('Erro ao carregar tópicos:', error);
                setHasData(false);
            }
        };

        getTopicosDisciplinas();
    }, [currentPage, disciplinaFilter, iterationData]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Breadcrumb page="Tópicos" />

            <section className="flex flex-col bg-white rounded-xl p-4 max-h-full overflow-hidden min-h-0">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 shrink-0">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">
                            Tópicos
                        </h1>

                        <SubjectFilter
                            setDisciplinaFilter={setDisciplinaFilter}
                            disciplinas={selectDisciplinas}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>

                    <Button
                        text="Cadastrar Tópico"
                        handleClick={() => setShowRegister(true)}
                        className="w-full lg:w-auto"
                    />
                </div>

                <div className="min-h-0 overflow-hidden">
                    <TableTopics
                        data={topicos}
                        selectDisciplinas={selectDisciplinas}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setIterationData}
                        hasData={hasData}
                    />
                </div>
            </section>

            {showRegister && (
                <RegisterTopic
                    handleCancel={() => setShowRegister(false)}
                    setIterationData={setIterationData}
                    currentPage={currentPage}
                    selectDisciplinas={selectDisciplinas}
                />
            )}
        </div>
    );
};

export default Topics;