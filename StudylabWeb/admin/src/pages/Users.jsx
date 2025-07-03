import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';
import { getAllUsersInfo } from "../../../platform/repository/user";

const Users = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [users, setUsers] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                let userList = await getAllUsersInfo(currentPage,10);
                setUsers(userList);
            } catch (error) {
                console.log(error);            
            }
        }
        getAllUsers();
    }, []);
    
    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Usuários' />
            <section className='rounded-xl bg-white px-4 '>
                <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                <TableUsers data={users}  currentPage={currentPage}
                setCurrentPage={setCurrentPage} handleDelete={removeItem} />
            </section>
        </div>
    );
};

export default Users;
