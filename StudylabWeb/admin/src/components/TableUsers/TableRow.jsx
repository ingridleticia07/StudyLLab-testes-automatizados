import { icons } from '../../assets/assets';

const TableRow = ({ matricula, aluno, curso, email }) => {
    return (
        <tr className='capitalize'>
            <td className='text-center'>
                <input type='checkbox' />
            </td>
            <td className='uppercase text-center'>{matricula}</td>
            <td>{aluno}</td>
            <td>{curso}</td>
            <td>{email}</td>
            <td className='flex justify-center gap-6'>
                <button aria-label='bloquear aluno'>
                    <img src={icons.block} alt='bloqueio' />
                </button>
                <button aria-label='excluir aluno'>
                    <img src={icons.deleteIcon} alt='lixeira' />
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
