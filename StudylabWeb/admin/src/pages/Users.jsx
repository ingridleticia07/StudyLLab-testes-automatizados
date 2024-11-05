import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';

// dados fakes para teste
import { usuarios } from '../data/dataFake';

const Users = () => {
    // time para carregamento dos dados na tabela
    const [data, setData] = useState(null);

    const loadDenucias = () => {
        setTimeout(() => {
            setData(usuarios);
        }, 300);
    };

    useEffect(() => {
        loadDenucias();
    });
    return (
        <div>
            <Breadcrumb page='Usuários' />
            <section className='rounded-lg bg-white px-4'>
                <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                <TableUsers data={data} />
            </section>
        </div>
    );
};

export default Users;
