import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';
import { getAllUsersInfo } from "../../../platform/repository/user";

const Users = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                let userList = await getAllUsersInfo(1,10);
                setUsers(userList);
            } catch (error) {
                console.log(error);            
            }
        }
        getAllUsers();
    }, []);
    
    return (
        <div>
            <Breadcrumb page='Usuários' />
            <section className='flex flex-col h-full mb-4 min-h-[450px] rounded-lg bg-white px-4'>
                <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                <TableUsers data={users} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Users;
