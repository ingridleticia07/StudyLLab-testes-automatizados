import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/Tables/TableSubjects';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';
import { getAllDisciplinasWithPagination } from "../../../platform/repository/disciplina";
import Filter from '../components/Filter/Filter';

const Subjects = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [cursoFilter, setCursoFilter] = useState('');
    const [disciplinas, setDisciplinas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);
    const [ hasData, SetHasData ] = useState(true);

    useEffect(() => {
        const getDataDisciplinas = async () => {
            
            try {
                
                const idCurso = cursoFilter || 0;
                let currentPageFilter = currentPage || 1;

                let disciplinasList = await getAllDisciplinasWithPagination(currentPageFilter, 10, idCurso);
                
                setDisciplinas(disciplinasList);
                if(disciplinasList.disciplinaCount == 0)
                    SetHasData(false);
                else
                    SetHasData(true);

                if(currentPage > disciplinasList.maxPage || currentPage == 0){
                    currentPageFilter = disciplinasList.maxPage;
                    setCurrentPage(currentPageFilter)
                }
            } catch (error) {
                console.log(error);
            }
        };
        getDataDisciplinas();
        
    }, [currentPage, cursoFilter, iterationData]);

    return (
        <div className="flex flex-col h-full">
            <Breadcrumb page="Disciplina" />
            
            <section className='rounded-xl bg-white px-4 '>
                <div className="flex flex-wrap items-center gap-2 px-4 py-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className="text-3xl font-bold">Disciplinas</h1>
                        <Filter data={disciplinas} setCursoFilter={setCursoFilter} setCurrentPage={setCurrentPage}/>
                    </div>
                    
                    <div className="flex-grow flex justify-end"> {/* Added mt-4 for some top margin and px for horizontal padding */}
                        <Button
                            text="Cadastrar Disciplina"
                            handleClick={() => setShowRegister(true)}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto px-2 sm:px-6">
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
