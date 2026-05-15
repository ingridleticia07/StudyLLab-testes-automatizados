import { useContext, useState } from 'react';

import { icons } from '../../assets/assets';

import Loading from '../Loading/Loading';
import TableHead from './TableHead';
import PopUp from '../PopUp/PopUp';
import EditSubject from '../EditSubject/EditSubject';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StudylabContext } from '../../context/StudylabContext';

import { deleteDisciplina } from '../../../../platform/repository/disciplina';

const TableSubjects = ({
    data,
    setDisciplinas,
    currentPage,
    setCurrentPage,
    setIterationData,
    hasData
}) => {

    const headersColumns = [
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

    const maxPage = data.maxPage || 1;

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

            await deleteDisciplina(identifier);

            setIterationData((prev) => prev + 1);

            toast.success('Item deletado', {
                theme: 'colored',
                position: 'top-center',
                autoClose: 1300,
            });

        } catch (error) {

            toast.warning(
                'Verifique se algum tópico possui esta disciplina!',
                {
                    theme: 'dark',
                    position: 'top-center',
                    autoClose: 4000,
                }
            );
        }
    };

    return (
        <div className="flex flex-col max-h-full border rounded-xl overflow-hidden">

            {/* Área scrollável — scroll fica confinado aqui */}
            <div className="flex-1 overflow-auto min-h-0">

                <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">

                    <TableHead headers={headersColumns} />

                    {data.disciplinas?.length > 0 ? (

                        <tbody>

                            {data.disciplinas.map((d, index) => (

                                <tr
                                    key={index}
                                    className="bg-white hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3 border-b">
                                        {d.codigoDisciplina}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.nomeDisciplina}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.professorDisciplina}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.curso.nomeCurso}
                                    </td>

                                    <td className="px-4 py-3 border-b text-center">
                                        {d.quantidadeAluno}
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        <div className="flex items-center justify-center gap-4">

                                            <button
                                                aria-label="editar disciplina"
                                                onClick={() => onEdit(d)}
                                            >
                                                <img
                                                    src={icons.pencil}
                                                    alt="lapis"
                                                    className="w-5 h-5"
                                                />
                                            </button>

                                            <button
                                                aria-label="deletar disciplina"
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
                            ${currentPage === 1
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100'}
                        `}
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
                                    ${currentPage === i + 1
                                        ? 'bg-americanOrange-500 text-white'
                                        : 'hover:bg-gray-100'}
                                `}
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
                            ${currentPage === maxPage
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100'}
                        `}
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
                <EditSubject
                    handleClose={() => setShowPopUpEdit(false)}
                    row={selectedItem}
                    setDisciplinas={setDisciplinas}
                    currentPage={currentPage}
                    setIterationData={setIterationData}
                />
            )}

            <ToastContainer className="capitalize" />

        </div>
    );
};

export default TableSubjects;