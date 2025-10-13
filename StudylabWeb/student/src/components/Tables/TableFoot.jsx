import { icons } from '../../assets/assets';

const TableFoot = ({ cols }) => {
    return (
        <tfoot className='sticky bottom-0 bg-gray-100 shadow-md'>
            <tr>
                <td colSpan={cols - 1} className='px-4 py-2 text-gray-700 font-medium text-end border-t'>
                    1 - 3
                </td>
                <td className='py-2 flex items-center justify-center border-t'>
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
