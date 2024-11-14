import { icons } from '../../assets/assets';

const FilterButton = () => {
    return (
        <div>
            <button className='flex items-center justify-between'>
                <p>Conteudo</p>
                <img src={icons.arrowRight} alt='' />
            </button>
        </div>
    );
};

export default FilterButton;
