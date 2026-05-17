import { useState, useEffect } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/Tables/TableSubjects';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';
import Filter from '../components/Filter/Filter';

import { getAllDisciplinasWithPagination } from "../../../platform/repository/disciplina";

const Subjects = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [cursoFilter, setCursoFilter] = useState('');
    const [disciplinas, setDisciplinas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        const getDataDisciplinas = async () => {
            try {
                const idCurso = cursoFilter || 0;
                let currentPageFilter = currentPage || 1;

                const disciplinasList =
                    await getAllDisciplinasWithPagination(
                        currentPageFilter,
                        10,
                        idCurso
                    );

                setDisciplinas(disciplinasList);

                setHasData(disciplinasList.disciplinaCount > 0);

                if (
                    currentPage > disciplinasList.maxPage &&
                    disciplinasList.maxPage > 0
                ) {
                    setCurrentPage(disciplinasList.maxPage);
                }

            } catch (error) {
                console.log(error);
            }
        };

        getDataDisciplinas();
    }, [currentPage, cursoFilter, iterationData]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Breadcrumb page="Disciplina" />

            <section className="flex flex-col bg-white rounded-xl p-4 max-h-full overflow-hidden min-h-0">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 shrink-0">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">
                            Disciplinas
                        </h1>

                        <Filter
                            data={disciplinas}
                            setCursoFilter={setCursoFilter}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>

                    <Button
                        text="Cadastrar Disciplina"
                        handleClick={() => setShowRegister(true)}
                        className="w-full lg:w-auto"
                    />
                </div>

                <div className="min-h-0 overflow-hidden">
                    <TableSubjects
                        data={disciplinas}
                        setDisciplinas={setDisciplinas}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setIterationData}
                        hasData={hasData}
                    />
                </div>
            </section>

            {showRegister && (
                <RegisterSubject
                    handleCancel={() => setShowRegister(false)}
                    setIterationData={setIterationData}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default Subjects;