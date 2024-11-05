import { icons } from '../../assets/assets';
import TableFoot from './TableFoot';
import TableHead from './TableHead';
import Loading from '../Loading/Loading';

const TableUsers = ({ data }) => {
    const headersColumns = [
        '#',
        'matricula',
        'aluno(a)',
        'curso',
        'email',
        'ações',
    ];

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
                                        <button aria-label='excluir aluno'>
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
        </div>
    );
};

export default TableUsers;
