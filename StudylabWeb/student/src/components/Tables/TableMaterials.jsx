import { useState } from 'react';

import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import StatusTag from '../StatusTag/StatusTag';
import TableHead from './TableHead';
import ViewMaterials from '../Viewer/ViewMaterials';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableMaterialsReadOnly = ({
    data,
    currentPage,
    setCurrentPage,
    setIterationData,
    hasData
}) => {

    const headersColumns = [
        'título',
        'disciplina',
        'autor',
        'tipo',
        'status',
        'ações',
    ];

    const tipoMaterial = ['Prova', 'Trabalho', 'Artigo', 'Tarefa', 'Pesquisa', 'Tcc', 'Outros'];
    const maxPage = data?.maxPage || 1;

    const [showPopUpVisualize, setShowPopUpVisualize] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');

    const onVisualize = (typeFile, dir1, dir2, dir3) => {
        setSelectedItem({
            typeFile,
            dir1,
            dir2,
            dir3
        });
        setShowPopUpVisualize(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= maxPage) {
            setCurrentPage(newPage);
        }
    };

    // Se não tem dados e não está carregando
    if (!data?.documentos?.length && !hasData) {
        return (
            <div className="flex flex-col max-h-full border rounded-xl overflow-hidden">
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <Loading hasData={hasData} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-full border rounded-xl overflow-hidden">

            {/* Área scrollável — scroll fica confinado aqui */}
            <div className="flex-1 overflow-auto min-h-0">

                <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0">

                    <TableHead headers={headersColumns} />

                    <tbody>

                        {data?.documentos?.length > 0 ? (

                            data.documentos.map((d, index) => (

                                <tr
                                    key={d.idDocumento || index}
                                    className="bg-white hover:bg-gray-50 capitalize"
                                >

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.topico?.nomeTopico || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.topico?.disciplina?.nomeDisciplina || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b break-words">
                                        {d.usuario?.nomeUsuario || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        {tipoMaterial[d.tipoMaterial - 1] || 'N/A'}
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        <StatusTag status={d.status} />
                                    </td>

                                    <td className="px-4 py-3 border-b">
                                        <div className="flex items-center justify-center">
                                            <button
                                                aria-label="visualizar material"
                                                onClick={() =>
                                                    onVisualize(
                                                        d.tipoArquivo,
                                                        d.diretorioMaterial1,
                                                        d.diretorioMaterial2,
                                                        d.diretorioMaterial3
                                                    )
                                                }
                                                className="p-2 rounded-md hover:bg-americanOrange-50 transition-colors duration-200 group"
                                            >
                                                <img
                                                    src={icons.eyeOpen}
                                                    alt="Visualizar"
                                                    className="w-5 h-5 filter group-hover:brightness-0 group-hover:opacity-80"
                                                    style={{ 
                                                        filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(360deg) brightness(98%) contrast(91%)'
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan={headersColumns.length}
                                    className="text-center py-10"
                                >
                                    <Loading hasData={hasData} />
                                </td>
                            </tr>

                        )}

                    </tbody>

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

            {showPopUpVisualize && (
                <ViewMaterials
                    itemForView={selectedItem}
                    handleClose={() => setShowPopUpVisualize(false)}
                />
            )}

            <ToastContainer className="capitalize" />

        </div>
    );
};

export default TableMaterialsReadOnly;