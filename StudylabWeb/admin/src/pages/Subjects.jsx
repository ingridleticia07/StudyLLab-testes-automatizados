import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/Tables/TableSubjects';

// dados fakes para teste
import { disciplinas } from '../data/dataFake';
import RegisterSubject from '../components/RegisterSubject/RegisterSubject';

const Subjects = () => {
    // time para carregamento dos dados na tabela
    const [data, setData] = useState(null);

    const [showRegister, setShowRegister] = useState(false);

    const loadDenucias = () => {
        setTimeout(() => {
            setData(disciplinas);
        }, 300);
    };

    useEffect(() => {
        loadDenucias();
    });

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
                <TableSubjects data={data} />
            </section>
            {showRegister && <RegisterSubject handleCancel={() => setShowRegister(false)}/>}
        </div>
    );
};

export default Subjects;
