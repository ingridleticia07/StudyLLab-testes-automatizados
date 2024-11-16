import { useContext } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';

const Users = () => {
    const { data, removeItem } = useContext(StudylabContext);
    return (
        <div>
            <Breadcrumb page='Usuários' />
            <section className='rounded-lg bg-white px-4'>
                <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                <TableUsers data={data.usuarios} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Users;
