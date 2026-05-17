import { useState, useEffect } from 'react';

import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Button from '../components/Buttons/Button';
import TableUsers from '../components/Tables/TableUsers';
import RegisterUserModal from '../components/RegisterUser/RegisterUser';
import FilterUser from '../components/Filter/FilterUser';

import { getAllUsersInfo } from "../../../platform/repository/user";

const Users = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [hasData, setHasData] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userTypeFilter, setUserTypeFilter] = useState(0);
    const [userStatusFilter, setUserStatusFilter] = useState(0);
    const [iterationData, setIterationData] = useState(0);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const userList = await getAllUsersInfo(
                    currentPage,
                    10,
                    userStatusFilter,
                    userTypeFilter
                );

                setUsers(userList);
                setHasData(userList.usersCount > 0);

                if (
                    userList.maxPage &&
                    currentPage > userList.maxPage &&
                    userList.maxPage > 0
                ) {
                    setCurrentPage(userList.maxPage);
                }

            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                setHasData(false);
            }
        };

        getAllUsers();
    }, [currentPage, iterationData, userStatusFilter, userTypeFilter]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Breadcrumb page="Usuários" />

            <section className="flex flex-col bg-white rounded-xl p-4 max-h-full overflow-hidden min-h-0">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 shrink-0">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">
                            Usuários
                        </h1>

                        <FilterUser 
                            setUserStatusFilter={setUserStatusFilter}  
                            setUserTypeFilter={setUserTypeFilter}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>

                    <Button
                        text="Cadastrar Usuário"
                        handleClick={() => setShowRegister(true)}
                        className="w-full lg:w-auto"
                    />
                </div>

                <div className="min-h-0 overflow-hidden">
                    <TableUsers
                        data={users}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setIterationData={setIterationData}
                        hasData={hasData}
                    />
                </div>
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