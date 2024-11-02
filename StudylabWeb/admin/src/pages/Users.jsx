import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUses from '../components/TableUsers/TableUses';

const Users = () => {
    return (
        <div>
            <Breadcrumb page='Usuários' />
            <section className='rounded-lg bg-white px-4'>
                <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                <TableUses />
            </section>
        </div>
    );
};

export default Users;
