import { icons } from '../../assets/assets';

import TableHead from './TableHead';
import TableFoot from './TableFoot';
import StatusTag from '../StatusTag/StatusTag';
import Loading from '../Loading/Loading';
import PopUp from '../PopUp/PopUp';
import { useState } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableReport = ({ data, handleDelete }) => {
    const headersColumns = [
        '#',
        'título',
        'disciplina',
        'autor',
        'data',
        'status',
        'ações',
    ];

    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');

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
                            <tr key={index} className='capitalize'>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.titulo}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.disciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.autor}
                                </td>
                                <td className='px-2 py-2 border-b whitespace-nowrap'>
                                    {d.data}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <StatusTag status={d.status} />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <div className='flex gap-5'>
                                        <button aria-label='visualizar'>
                                            <img
                                                src={icons.eyeOpen}
                                                alt='Visualizar'
                                            />
                                        </button>
                                        <button aria-label='bloquear'>
                                            <img
                                                src={icons.block}
                                                alt='bloquear'
                                            />
                                        </button>
                                        <button
                                            aria-label='excluir'
                                            onClick={() =>
                                                onDelete(
                                                    d.id,
                                                    'denuncias',
                                                    d.titulo
                                                )
                                            }
                                        >
                                            <img
                                                src={icons.deleteIcon}
                                                alt='Excluir'
                                            />
                                        </button>
                                    </div>
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

export default TableReport;
