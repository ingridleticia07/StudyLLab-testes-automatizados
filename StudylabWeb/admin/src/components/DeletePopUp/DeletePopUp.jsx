import { icons } from '../../assets/assets';

const DeletePopUp = () => {
    return (
        <div className='bg-white flex flex-col justify-between p-8 h-56 w-[400px] rounded-lg shadow-lg'>
            <div className='flex items-center justify-between'>
                <h3>Confimar exclusão</h3>
                <img src={icons.cross} alt='' />
            </div>
            <div>
                <p>Tem certeza de que deseja excluir esta disciplina?</p>
                <p>Esta ação é irreversível.</p>
            </div>
            <div className='flex items-center justify-between'>
                <button className='px-3 py-2 text-americanOrange-500 border-2 border-americanOrange-500 rounded-md'>Cancelar</button>
                <button className='px-4 py-2 text-white bg-americanOrange-500 rounded-md'>Excluir</button>
            </div>
        </div>
    );
};

export default DeletePopUp;
