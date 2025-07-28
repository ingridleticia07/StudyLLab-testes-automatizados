import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Button from '../components/Buttons/Button';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';
import { getAllUsersInfo } from "../../../platform/repository/user";
import RegisterUserModal from '../components/RegisterUser/RegisterUser';

const Users = () => {
    const [showRegister, setShowRegister] = useState(false);
    const { data, removeItem } = useState();
    const [users, setUsers] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [iterationData, setIterationData] = useState(0);

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
    }, [iterationData]);
    
    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Usuários' />
            
            <section className='rounded-xl bg-white px-4 '>
                <div className="flex flex-wrap items-center gap-2 px-4 py-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <h1 className='text-3xl font-bold py-8'>Usuarios</h1>
                    </div>
                    <div className="flex-grow flex justify-end">
                        <Button
                            text="Cadastrar usuário"
                            handleClick={() => setShowRegister(true)}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
                <TableUsers data={users}  currentPage={currentPage}
                setCurrentPage={setCurrentPage} setIterationData={setIterationData} />
            </section>
            {showRegister && (
                <RegisterUserModal
                    handleCancel={() => setShowRegister(false)}
                    setIterationData={setIterationData}
                    currentPage={currentPage}
                />
            )}
        </div>
    );
};

export default Users;
