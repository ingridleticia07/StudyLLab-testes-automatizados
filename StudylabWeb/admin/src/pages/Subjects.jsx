import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableSubjects from '../components/TableSubjects/TableSubjects';

const Subjects = () => {
    return (
        <div>
            <Breadcrumb page='Disciplina' />
            <section className='rounded-xl bg-white px-4'>
                <div className='flex items-center justify-between px-6 py-6'>
                    <h1 className='text-3xl font-bold'>Disciplinas</h1>
                    <Button text={'Cadastrar Disciplina'} />
                </div>
                <TableSubjects />
            </section>
        </div>
    );
};

export default Subjects;
