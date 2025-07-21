import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/Tables/TableSubjects';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';
import { getAllDisciplinasWithPagination } from "../../../platform/repository/disciplina";

const Subjects = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [disciplinas, setDisciplinas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getDataDisciplinas = async () => {
            try {
                let disciplinas = await getAllDisciplinasWithPagination(currentPage, 10);
                setDisciplinas(disciplinas);
            } catch (error) {
                console.log(error);
            }
        };
        getDataDisciplinas();
    }, [currentPage]);

    return (
        <div className="flex flex-col h-full">
            <Breadcrumb page="Disciplina" />
            
            <section className="rounded-xl bg-white px-4 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 sm:px-6 py-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Disciplinas</h1>
                    <Button
                        text="Cadastrar Disciplina"
                        handleClick={() => setShowRegister(true)}
                        className="w-full sm:w-auto"
                    />
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
