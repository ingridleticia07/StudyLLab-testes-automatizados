import { useContext,useEffect,useState } from 'react';
import { StudylabContext } from '../context/StudylabContext';
import Button from '../components/Buttons/Button';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import TableUsers from '../components/Tables/TableUsers';
import { getAllUsersInfo } from "../../../platform/repository/user";
import RegisterUserModal from '../components/RegisterUser/RegisterUser';
import FilterUser from '../components/Filter/FilterUser';

const Users = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [ hasData, SetHasData ] = useState(true);
    const [users, setUsers] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [UserTypeFilter, setUserTypeFilter] = useState(0);
    const [UserStatusFiler, setUserStatusFiler] = useState(0);
    const [iterationData, setIterationData] = useState(0);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                let userList = await getAllUsersInfo(currentPage,10,UserStatusFiler,UserTypeFilter);
                setUsers(userList);
                
                if(userList.usersCount == 0)
                    SetHasData(false);
                else
                    SetHasData(true);
            } catch (error) {
                console.log(error);   
                SetHasData(false);         
            }
        }
        getAllUsers();
    }, [currentPage,iterationData, UserStatusFiler, UserTypeFilter]);
    
    return (
        <div className='flex flex-col h-full'>
            <Breadcrumb page='Usuários' />
            
            <section className='rounded-xl bg-white px-4'>
                <div className="flex flex-col lg:flex-row lg:flex-wrap items-center gap-2 px-0 lg:px-2 py-4">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 w-full lg:w-auto mb-2 lg:mb-0">
                        <h1 className='text-3xl font-bold py-4 lg:py-8'>Usuarios</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full lg:w-auto">
                            <FilterUser setUserStatusFiler={setUserStatusFiler} setUserTypeFilter={setUserTypeFilter} setCurrentPage={setCurrentPage}/>
                            <div className="sm:flex-grow sm:flex sm:justify-end lg:hidden">
                                <Button
                                    text="Cadastrar usuário"
                                    handleClick={() => setShowRegister(true)}
                                    className="w-full sm:w-auto"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:flex lg:flex-grow lg:justify-end">
                        <Button
                            text="Cadastrar usuário"
                            handleClick={() => setShowRegister(true)}
                            className="w-full lg:w-auto"
                        />
                    </div>
                </div>
                <TableUsers data={users} currentPage={currentPage}
                setCurrentPage={setCurrentPage} setIterationData={setIterationData} hasData={hasData}/>
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
