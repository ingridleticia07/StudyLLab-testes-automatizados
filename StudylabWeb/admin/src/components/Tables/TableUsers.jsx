import { useState } from 'react';

import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';
import EditUser from '../EditUser/EditUser';
import StatusTagUser from '../StatusTag/StatusTagUser';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { deleteUser } from '../../../../platform/repository/user';

const HEADERS = [
    'matrícula',
    'usuário(a)',
    'tipo',
    'status',
    'curso',
    'email',
    'ações',
];

const TIPO_USER = ['Aluno', 'Admin', 'Professor'];

const TOAST_CONFIG = { position: 'top-center', autoClose: 1300 };

const TableUsers = ({ data, currentPage, setCurrentPage, setIterationData, hasData }) => {

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);
    const [showPopUpEdit, setShowPopUpEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const maxPage = data?.maxPage || 1;

    const onEdit = (item) => {
        setSelectedItem({ item });
        setShowPopUpEdit(true);
    };

    const onDelete = (id, key, name) => {
        setSelectedItem({ id, key, name });
        setShowPopUpDelete(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= maxPage) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteRegister = async (identifier) => {
        try {
            await deleteUser(identifier);
            setIterationData((prev) => prev + 1);
            toast.success('Usuário deletado', { ...TOAST_CONFIG, theme: 'colored' });
        } catch (error) {
            toast.error(error?.message || 'Erro ao deletar usuário', { ...TOAST_CONFIG, autoClose: 4000, theme: 'dark' });
        }
    };

    return (
        <div className="flex flex-col max-h-full border rounded-xl overflow-hidden">

            {/* Área scrollável */}
            <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">

                    <TableHead headers={HEADERS} />

                    <tbody>
                        {data?.users?.length > 0 ? (
                            data.users.map((d, index) => (
                                <tr key={d.id || index} className="bg-white hover:bg-gray-50 capitalize">
                                    <td className="px-4 py-3 border-b">{d.matricula}</td>
                                    <td className="px-4 py-3 border-b break-words">{d.username}</td>
                                    <td className="px-4 py-3 border-b">{TIPO_USER[d.role] || 'N/A'}</td>
                                    <td className="px-4 py-3 border-b"><StatusTagUser status={d.active} /></td>
                                    <td className="px-4 py-3 border-b break-words">{d.curso?.nome || 'N/A'}</td>
                                    <td className="px-4 py-3 border-b break-words">{d.email}</td>
                                    <td className="px-4 py-3 border-b">
                                        {d.role === 0 && (
                                            <div className="flex items-center justify-center gap-4">
                                                <button aria-label="editar usuário" onClick={() => onEdit(d)}>
                                                    <img src={icons.pencil} alt="editar" className="w-5 h-5" />
                                                </button>
                                                <button aria-label="deletar usuário" onClick={() => onDelete(d.id, 'usuarios', d.username)}>
                                                    <img src={icons.deleteIcon} alt="lixeira" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={HEADERS.length} className="text-center py-10">
                                    <Loading hasData={hasData} />
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Paginação */}
            {maxPage > 1 && (
                <div className="flex items-center justify-center gap-2 border-t bg-white p-4 flex-wrap shrink-0">

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-200
                            ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    >
                        ←
                    </button>

                    {Array.from({ length: maxPage }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            aria-label={`Ir para página ${i + 1}`}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200
                                ${currentPage === i + 1 ? 'bg-americanOrange-500 text-white' : 'hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === maxPage}
                        aria-label="Próxima página"
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-200
                            ${currentPage === maxPage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    >
                        →
                    </button>

                </div>
            )}

            {showPopUpDelete && (
                <PopUp
                    itemDelete={selectedItem}
                    handleClose={() => setShowPopUpDelete(false)}
                    handleDeleteConfirmation={handleDeleteRegister}
                />
            )}

            {showPopUpEdit && (
                <EditUser
                    handleClose={() => setShowPopUpEdit(false)}
                    row={selectedItem}
                    setIterationData={setIterationData}
                />
            )}

            <ToastContainer className="capitalize" />

        </div>
    );
};

export default TableUsers;