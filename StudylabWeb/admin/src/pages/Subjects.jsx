import { useContext, useState, useEffect } from 'react';
import { StudylabContext } from '../context/StudylabContext';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/Tables/TableSubjects';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';
import { getAllDisciplinasWithPagination } from "../../../platform/repository/disciplina";

const Subjects = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [disciplinas, setDisciplinas] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getDataDisciplinas = async () => {
            try {
                let disciplinas = await getAllDisciplinasWithPagination(currentPage,10);
                setDisciplinas(disciplinas);
            } catch (error) {
                console.log(error);            
            }
        }
        getDataDisciplinas();
    }, [currentPage]);
    
    return (
        <div>
            <Breadcrumb page='Disciplina' />
            <section className='rounded-xl bg-white px-4'>
                <div className='flex items-center justify-between px-6 py-6'>
                    <h1 className='text-3xl font-bold'>Disciplinas</h1>
                    <Button
                        text={'Cadastrar Disciplina'}
                        handleClick={() => setShowRegister(true)}
                    />
                </div>
                <TableSubjects data={disciplinas} currentPage={currentPage}
                setCurrentPage={setCurrentPage} handleDelete={removeItem} />
            </section>
            {showRegister && (
                <RegisterSubject handleCancel={() => setShowRegister(false)} />
            )}
        </div>
    );
};

export default Subjects;
