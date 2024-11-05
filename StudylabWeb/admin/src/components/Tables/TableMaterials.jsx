import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import StatusTag from '../StatusTag/StatusTag';
import TableFoot from './TableFoot';
import TableHead from './TableHead';

const TableMaterials = ({ data }) => {
    const headersColumns = [
        '#',
        'título',
        'disciplina',
        'autor',
        'tipo',
        'status',
        'ações',
    ];

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
                                <td className='px-4 py-2 border-b'>{d.tipo}</td>
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
                                        <button aria-label='excluir'>
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
        </div>
    );
};

export default TableMaterials;
