import { useState } from 'react';
import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import PopUp from '../PopUp/PopUp';
import StatusTag from '../StatusTag/StatusTag';
import TableFoot from './TableFoot';
import TableHead from './TableHead';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableMaterials = ({ data, currentPage, setCurrentPage, handleDelete }) => {
    const headersColumns = [
        '#',
        'título',
        'disciplina',
        'autor',
        'tipo',
        'status',
        'ações',
    ];
    
    const [showPopUp, setShowPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [tipoMaterial] = useState(['prova','Trabalho','pdf','Artigo','atividade']);
    const maxPage = data.maxPage;

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

    return (
        <div className='h-full max-h-[350px] overflow-y-scroll rounded-md'>
            <table className='h-full min-w-full text-left border-separate border-spacing-0'>
                <TableHead headers={headersColumns} />
                {data.documentos && data.documentos.length > 0 ? (
                    <tbody>
                        {data.documentos.map((d, index) => (
                            <tr key={index} className='capitalize'>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.topico.nomeTopico
                                    }
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.topico.disciplina.nomeDisciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.usuario.nomeUsuario}
                                </td>
                                <td className='px-4 py-2 border-b'>{tipoMaterial[d.tipoMaterial]}</td>
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
                                        <button
                                            aria-label='excluir'
                                            onClick={() =>
                                                onDelete(
                                                    d.id,
                                                    'conteudos',
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
                    handleDeleteConfirmation={handleDelete}
                />
            )}
        </div>
    );
};

export default TableMaterials;
