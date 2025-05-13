import { useContext, useState } from 'react';
import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditSubject from '../EditSubject/EditSubject';
import { StudylabContext } from '../../context/StudylabContext';

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

    const [showPopUpDelete, setShowPopUpDelete] = useState(false);
    const [showPopUpEdit, setShowPopUpEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    const { searchSubject } = useContext(StudylabContext);

    const onEdit = (id) => {
        setShowPopUpEdit(true);
        const item = searchSubject(id);
        setSelectedItem(item);
    };

    const onDelete = (id, key, name) => {
        setShowPopUpDelete(true);
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
                {data.disciplinas && data.disciplinas.length > 0 ? (
                    <tbody>
                        {data.disciplinas.map((d, index) => (
                            <tr key={index}>
                                <td className='px-4 py-2 border-b'>
                                    <input type='checkbox' />
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.codigoDisciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.nomeDisciplina}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.professor.nomeUsuario}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.curso.nomeCurso}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    {d.quantidadeAluno}
                                </td>
                                <td className='px-4 py-2 border-b'>
                                    <div className='flex gap-5'>
                                        <button aria-label='editar disciplina'>
                                            <img
                                                src={icons.pencil}
                                                alt='lapis'
                                                onClick={() => onEdit(d.idDisciplina)}
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
                    <Loading />
                )}
                <TableFoot cols={headersColumns.length} />
            </table>

            {showPopUpDelete && (
                <PopUp
                    itemDelete={selectedItem}
                    handleClose={() => setShowPopUpDelete(false)}
                    handleDeleteConfirmation={handleDelete}
                />
            )}
            {showPopUpEdit && (
                <EditSubject
                    handleClose={() => setShowPopUpEdit(false)}
                    item={selectedItem}
                />
            )}
            <ToastContainer className='capitalize' />
        </div>
    );
};

export default TableSubjects;
