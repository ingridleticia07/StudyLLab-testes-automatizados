import { useContext, useState } from 'react';
import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSubject from '../EditSubject/EditSubject';
import { StudylabContext } from '../../context/StudylabContext';
import {deleteDisciplina, getAllDisciplinasWithPagination} from '../../../../platform/repository/disciplina';

const TableTopics = ({ data, setSelectDisciplinas, currentPage, setCurrentPage, setIterationData, hasData }) => {
    
    const headersColumns = [
        '#',
        'Tópico',
        'nome da disciplina',
        'data',
        'professor(a)',
        'autor',
        'ações',
    ];

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);
    const [showPopUpEdit, setShowPopUpEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const { searchSubject } = useContext(StudylabContext);
    const maxPage = data.maxPage;
    
    const onEdit = (item) => {
        setShowPopUpEdit(true);
        setSelectedItem({
            item
        });
    };

    const onDelete = (id, key, name) => {
        setShowPopUpDelete(true);
        setSelectedItem({
            id,
            key,
            name,
        });
    };
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= maxPage) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteRegister = async(identifier,key) => {
        try {
            await deleteDisciplina(identifier);
            setIterationData((prev) => prev + 1);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="overflow-auto max-h-[350px] rounded-md">
            <table className="w-full min-w-full text-left border-separate border-spacing-0 table-auto">
                <TableHead headers={headersColumns} />
                {data.topicos && data.topicos.length > 0 ? (
                    <tbody>
                        {data.topicos.map((d, index) => (
                            <tr key={index}>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.nomeTopico}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.disciplina.nomeDisciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {new Date(d.dataTopico).toLocaleDateString('pt-BR')}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.disciplina.professorDisciplina} 
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.usuario.nomeUsuario}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <div className='flex gap-5'>
                                        <button aria-label='editar disciplina'>
                                            <img
                                                src={icons.pencil}
                                                alt='lapis'
                                                onClick={() => onEdit(d)}
                                            />
                                        </button>
                                        <button
                                            aria-label='deletar disciplina'
                                            onClick={() =>
                                                onDelete(
                                                    d.idDisciplina,
                                                    'disciplinas',
                                                    d.nomeDisciplina
                                                )
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

            {showPopUpDelete && (
                <PopUp
                    itemDelete={selectedItem}
                    handleClose={() => setShowPopUpDelete(false)}
                    handleDeleteConfirmation={handleDeleteRegister}
                />
            )}
            {/*showPopUpEdit && (
                <EditSubject
                    handleClose={() => setShowPopUpEdit(false)}
                    row={selectedItem}
                    setDisciplinas={setDisciplinas}
                    currentPage={currentPage}
                    setIterationData={setIterationData}
                />
            )*/}
            <ToastContainer className='capitalize' />
        </div>
    );
};

export default TableTopics;
