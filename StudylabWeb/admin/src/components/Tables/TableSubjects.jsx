import { useState } from 'react';
import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableSubjects = ({ data, handleDelete }) => {
    const headersColumns = [
        '#',
        'código',
        'nome da disciplina',
        'professor(a)',
        'curso',
        'aluno',
        'ações',
    ];

    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    const onDelete = (id, key, name) => {
        setShowPopUp(true);
        setSelectedItem({
            id,
            key,
            name,
        });
    };

    return (
        <div className='h-full max-h-[350px] overflow-y-scroll rounded-md'>
            <table className='h-full min-w-full text-left border-separate border-spacing-0'>
                <TableHead headers={headersColumns} />
                {data && data.length > 0 ? (
                    <tbody>
                        {data.map((d, index) => (
                            <tr key={index}>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.codigo}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.nomeDisciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.professor}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.curso}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.quantidadeAlunos}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <div className='flex gap-5'>
                                        <button aria-label='editar disciplina'>
                                            <img
                                                src={icons.pencil}
                                                alt='lapis'
                                            />
                                        </button>
                                        <button
                                            aria-label='deletar disciplina'
                                            onClick={() =>
                                                onDelete(d.id, 'disciplinas', d.nomeDisciplina)
                                            }
                                        >
                                            <img
                                                src={icons.deleteIcon}
                                                alt='lixeira'
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

export default TableSubjects;
