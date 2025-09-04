import { icons } from '../../assets/assets';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import Loading from '../Loading/Loading';
import { useState } from 'react';
import PopUp from '../PopUp/PopUp';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatusTagUser from '../StatusTag/StatusTagUser';
import { deleteUser} from "../../../../platform/repository/user";
import EditUser from '../EditUser/EditUser';

const TableUsers = ({ data, currentPage, setCurrentPage, setIterationData,hasData }) => {
    const headersColumns = [
        '#',
        'matricula',
        'usuário(a)',
        'Tipo',
        'Status',
        'curso',
        'email',
        'ações',
    ];
    const tipoUser = ['Aluno','Admin','Professor'];
    const [showPopUp, setShowPopUp] = useState(false);
    const [showPopUpEdit, setShowPopUpEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const maxPage = data.maxPage;

    const onEdit = (item) => {
        setShowPopUpEdit(true);
        setSelectedItem({
            item
        });
    };

    const onDelete = (id, key, name) => {
        
        setSelectedItem({
            id,
            key,
            name,
        });
        setShowPopUp(true);
    };
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= maxPage) {
            setCurrentPage(newPage);
        }
    };
    
    const handleDeleteRegister = async(identifier) => {
        try {
            await deleteUser(identifier);
            setIterationData((prev) => prev + 1);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="overflow-auto max-h-[350px] rounded-md">
            <table className="w-full min-w-full text-left border-separate border-spacing-0 table-auto">
                <TableHead headers={headersColumns} />
                {data.users && data.users.length > 0 ? (
                    <tbody>
                        {data.users.map((d, index) => (
                            <tr key={index} className='capitalize'>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.matricula}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.username}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {tipoUser[d.role]}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <StatusTagUser status={d.active}/>
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.curso.nome}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.email}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <div className='flex gap-5'>
                                        
                                        {/*<button aria-label='bloquear aluno'>
                                            <img
                                                src={icons.block}
                                                alt='bloqueio'
                                            />
                                        </button>*/}
                                        <button
                                            aria-label='excluir aluno'
                                            onClick={() =>
                                                onDelete(d.id, 'usuarios', d.username)
                                            }
                                        >
                                            <img
                                                src={icons.deleteIcon}
                                                alt='lixeira'
                                            />
                                        </button>
                                        {
                                            d.role == 0 &&(
                                                <button
                                                    aria-label='editar aluno'
                                                    onClick={() =>
                                                        onEdit(d)
                                                    }
                                                >
                                                    <img
                                                        src={icons.pencil}
                                                        alt='editar'
                                                    />
                                                </button>
                                            )
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <Loading hasData={hasData}/>
                )}
                <tfoot>
                    {maxPage > 1 && (
                        <tr>
                            <td colSpan={headersColumns.length} className="px-4 py-2 sticky bottom-0 bg-gray-100 shadow-md text-center">
                                {Array.from({ length: maxPage }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-full mx-1 ${
                                    currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                                ))}
                            </td>
                        </tr>
                    )}
                </tfoot>
            </table>

            {showPopUp && (
                <PopUp
                    itemDelete={selectedItem}
                    handleClose={() => setShowPopUp(false)}
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
            <ToastContainer className='capitalize'/>
        </div>
    );
};

export default TableUsers;
