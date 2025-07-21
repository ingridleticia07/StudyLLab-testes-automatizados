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
    
    useEffect(() => {
        const getDataDisciplinas = async () => {
            
            try {
                let allDisciplinas = await getAllDisciplinasWithPagination(currentPage, 10);
                let disciplinasFilter = allDisciplinas.disciplinas || [];

                if (cursoFilter && cursoFilter > 0) {
                    disciplinasFilter = disciplinasFilter.filter(
                        (d) => String(d.curso?.idCurso) == String(cursoFilter)
                    );
                }
                
                let finalDisciplinaLista = [];
                finalDisciplinaLista.maxPage = allDisciplinas.maxPage;
                finalDisciplinaLista.disciplinaCount = allDisciplinas.disciplinaCount;
                finalDisciplinaLista.pageCount = allDisciplinas.pageCount;
                finalDisciplinaLista.disciplinas = disciplinasFilter;
                
                setDisciplinas(finalDisciplinaLista);
            } catch (error) {
                console.log(error);
            }
        };
        getDataDisciplinas();
        
    }, [currentPage, cursoFilter]);

    return (
        <div className="flex flex-col h-full">
            <Breadcrumb page="Disciplina" />
            
            <section className='rounded-xl bg-white px-4 '>
                <div className="flex flex-wrap items-center gap-2 px-4 py-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className="text-3xl font-bold">Disciplinas</h1>
                        <Filter data={disciplinas} setCursoFilter={setCursoFilter}/>
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
                        handleDelete={(id) => {
                            // implemente a remoção aqui se quiser
                        }}
                    />
                </div>
            </section>

            {showRegister && (
                <RegisterSubject
                    handleCancel={() => setShowRegister(false)}
                    setDisciplinas={setDisciplinas}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default Subjects;
