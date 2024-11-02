import { icons } from '../../assets/assets';

const TableFoot = () => {
    return (
        <tfoot className='bg-gray-100 border-t-2'>
            <tr>
                <td colSpan='5'></td>
                <td className='text-gray-700 font-medium'>1 - 3</td>
                <td className='flex items-center justify-center'>
                    <button
                        className='flex items-center justify-center h-5 w-5 rounded-full border border-gray-400 hover:bg-gray-300'
                        aria-label='Passar para proxima pagina'
                    >
                        <img src={icons.arrowLeft} alt='Anterior' />
                    </button>
                    <p className='mx-2'>
                        1<span className='text-slate-500 '>/1</span>
                    </p>
                    <button
                        className='flex items-center justify-center h-5 w-5 rounded-full border border-gray-400 hover:bg-gray-300'
                        aria-label='Voltar para pagina anteriro'
                    >
                        <img src={icons.arrowRight} alt='Proximo' />
                    </button>
                </td>
            </tr>
        </tfoot>
    );
};

export default TableFoot;
