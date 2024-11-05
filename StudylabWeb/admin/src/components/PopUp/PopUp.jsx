import { icons } from "../../assets/assets";

const PopUp = ({ itemDelete = '', onClose }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 bg-gray-300'>
            <div className='bg-white flex flex-col tracking-wide rounded-lg shadow-lg px-8 py-7 gap-8'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-semibold'>
                        Confirmar exclusão
                    </h2>
                    <button aria-label='fechar janela' onClick={onClose}>
                        <img src={icons.cross} alt='x' />
                    </button>
                </div>
                <div className='text-lg'>
                    <p>Tem certeza de que deseja excluir: 
                        {itemDelete}
                    </p>
                    <p>Esta ação é irreversível.</p>
                </div>
                <div className='flex items-center justify-between text-lg'>
                    <button
                        className='px-2 py-1 rounded-lg border-2 border-americanOrange-500 text-americanOrange-500 hover:bg-americanOrange-50'
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button className='px-4 py-1 rounded-lg border-2 border-americanOrange-500 bg-americanOrange-500 text-white hover:bg-americanOrange-600 hover:border-americanOrange-600'>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
