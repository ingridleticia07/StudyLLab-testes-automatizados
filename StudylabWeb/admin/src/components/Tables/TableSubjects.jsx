import { icons } from '../../assets/assets';
import Loading from '../Loading/Loading';
import TableFoot from './TableFoot';
import TableHead from './TableHead';

const TableSubjects = ({ data }) => {
    const headersColumns = [
        '#',
        'código',
        'nome da disciplina',
        'professor(a)',
        'curso',
        'aluno',
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
                                        <button aria-label='deletar disciplina'>
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
        </div>
    );
};

export default TableSubjects;
