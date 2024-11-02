import { icons } from '../../assets/assets';

const SearchInput = () => {
    return (
        <div className='flex items-center justify-between w-1/3 h-10 px-4 bg-gray-100 rounded-lg border-2 border-gray-200'>
            <input
                type='text'
                placeholder='Procurar...'
                aria-label='campo de pesquisa'
                className='w-full text-gray-700 font-inter'
            />
            <button aria-label='botão de pesquisa'>
                <img
                    src={icons.search}
                    alt='icone de pesquisa'
                    className='w-6 h-6 ml-2 '
                />
            </button>
        </div>
    );
};

export default SearchInput;
