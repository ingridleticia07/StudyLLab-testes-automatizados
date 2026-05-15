import { useContext, useState } from 'react';

import { icons } from '../../assets/assets';

import Loading from '../Loading/Loading';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';
import EditTopic from '../EditTopic/EditTopic';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StudylabContext } from '../../context/StudylabContext';

import { deleteTopicoDisciplina } from '../../../../platform/repository/topico';

const TableTopics = ({
    data,
    selectDisciplinas,
    currentPage,
    setCurrentPage,
    setIterationData,
    hasData
}) => {

    const headersColumns = [
        'tópico',
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

    const maxPage = data?.maxPage || 1;

    const onEdit = (item) => {
        setShowPopUpEdit(true);
        setSelectedItem({ item });
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

    const handleDeleteRegister = async (identifier) => {
        try {
            await deleteTopicoDisciplina(identifier);

            setIterationData((prev) => prev + 1);

            toast.success('Item deletado', {
                theme: 'colored',
                position: 'top-center',
                autoClose: 1300,
            });

        } catch (error) {
            toast.error(error?.message || 'Erro ao deletar tópico', {
                theme: 'dark',
                position: 'top-center',
                autoClose: 4000,
            });
        }
    };

    return (
        <div className="flex flex-col max-h-full border rounded-xl overflow-hidden">

            {/* Área scrollável — scroll fica confinado aqui */}
            <div className="flex-1 overflow-auto min-h-0">

                <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">

                    <TableHead headers={headersColumns} />

                    {data?.topicos?.length > 0 ? (

                        <tbody>

                            {data.topicos.map((d, index) => (

                                <tr
                                    key={d.idTopico || index}
                                    className="bg-white hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.nomeTopico}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.disciplina?.nomeDisciplina || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        {new Date(d.dataTopico).toLocaleDateString('pt-BR')}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.disciplina?.professorDisciplina || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.usuario?.nomeUsuario || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        <div className="flex items-center justify-center gap-4">

                                            <button
                                                aria-label="editar tópico"
                                                onClick={() => onEdit(d)}
                                            >
                                                <img
                                                    src={icons.pencil}
                                                    alt="lapis"
                                                    className="w-5 h-5"
                                                />
                                            </button>

                                            <button
                                                aria-label="deletar tópico"
                                                onClick={() =>
                                                    onDelete(
                                                        d.idTopico,
                                                        'topicos',
                                                        d.nomeTopico
                                                    )
                                                }
                                            >
                                                <img
                                                    src={icons.deleteIcon}
                                                    alt="lixeira"
                                                    className="w-5 h-5"
                                                />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    ) : (

                        <tbody>
                            <tr>
                                <td
                                    colSpan={headersColumns.length}
                                    className="h-[300px]"
                                >
                                    <div className="flex items-center justify-center h-full w-full">
                                        <Loading hasData={hasData} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    )}

                </table>

            </div>

            {/* Paginação — sempre visível, nunca some com o scroll */}
            {maxPage > 1 && (

                <div className="flex items-center justify-center gap-2 border-t bg-white p-4 flex-wrap shrink-0">

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`
                            w-9 h-9 rounded-full border
                            flex items-center justify-center
                            transition-colors duration-200
                            ${currentPage === 1
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100'}
                        `}
                        aria-label="Página anterior"
                    >
                        ←
                    </button>

                    {Array.from(
                        { length: maxPage },
                        (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`
                                    w-9 h-9 rounded-full
                                    flex items-center justify-center
                                    transition-colors duration-200
                                    ${currentPage === i + 1
                                        ? 'bg-americanOrange-500 text-white'
                                        : 'hover:bg-gray-100'}
                                `}
                                aria-label={`Ir para página ${i + 1}`}
                            >
                                {i + 1}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === maxPage}
                        className={`
                            w-9 h-9 rounded-full border
                            flex items-center justify-center
                            transition-colors duration-200
                            ${currentPage === maxPage
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100'}
                        `}
                        aria-label="Próxima página"
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
                <EditTopic
                    handleCancel={() => setShowPopUpEdit(false)}
                    setIterationData={setIterationData}
                    currentPage={currentPage}
                    selectDisciplinas={selectDisciplinas}
                    selectedItem={selectedItem}
                />
            )}

            <ToastContainer className="capitalize" />

        </div>
    );
};

export default TableTopics;