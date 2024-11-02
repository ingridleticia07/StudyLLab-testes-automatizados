import { icons } from '../../assets/assets';

const TableRow = ({ id, disciplina, professor, curso, alunos }) => {
    return (
        <tr className='capitalize'>
            <td className='text-center'>
                <input type='checkbox' />
            </td>
            <td className='uppercase text-center'>{id}</td>
            <td>{disciplina}</td>
            <td>{professor}</td>
            <td>{curso}</td>
            <td className='text-center'>{alunos}</td>
            <td className='flex justify-evenly'>
                <button aria-label='editar disciplina'>
                    <img src={icons.pencil} alt='lapis' />
                </button>
                <button aria-label='deletar disciplina'>
                    <img src={icons.deleteIcon} alt='lixeira' />
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
