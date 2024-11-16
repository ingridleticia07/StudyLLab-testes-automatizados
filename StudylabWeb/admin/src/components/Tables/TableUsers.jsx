import { icons } from '../../assets/assets';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import Loading from '../Loading/Loading';
import { useState } from 'react';
import PopUp from '../PopUp/PopUp';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableUsers = ({ data, handleDelete }) => {
    const headersColumns = [
        '#',
        'matricula',
        'aluno(a)',
        'curso',
        'email',
        'ações',
    ];

    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    const onDelete = (id, key, name) => {
        setSelectedItem({
            id,
            key,
            name,
        });
        setShowPopUp(true);
    };

    return (
        <div className='h-full max-h-[350px] overflow-y-scroll rounded-md'>
            <table className='h-full min-w-full text-left border-separate border-spacing-0'>
                <TableHead headers={headersColumns} />
                {data ? (
                    <tbody>
                        {data.map((d, index) => (
                            <tr key={index}>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.matricula}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.aluno}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.curso}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.email}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <td className='flex justify-center gap-6'>
                                        <button aria-label='bloquear aluno'>
                                            <img
                                                src={icons.block}
                                                alt='bloqueio'
                                            />
                                        </button>
                                        <button
                                            aria-label='excluir aluno'
                                            onClick={() =>
                                                onDelete(d.id, 'usuarios', d.aluno)
                                            }
                                        >
                                            <img
                                                src={icons.deleteIcon}
                                                alt='lixeira'
                                            />
                                        </button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <Loading />
                )}
                <TableFoot cols={headersColumns.length} />
            </table>

            {showPopUp && (
                <PopUp
                    itemDelete={selectedItem}
                    handleClose={() => setShowPopUp(false)}
                    handleDeleteConfirmation={handleDelete}
                />
            )}
            <ToastContainer className='capitalize'/>
        </div>
    );
};

export default TableUsers;
