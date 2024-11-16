import SearchInput from '../Inputs/SearchInput';
import UserProfile from '../UserProfile/UserProfile';

const Menu = () => {
    return (
        <header className='absolute z-10 flex items-center justify-between w-full h-24 px-20 bg-white shadow-md'>
            <h1 className='text-americanOrange-500 text-4xl font-urbanist '>
                Study
                <span className='font-bold'>Lab</span>
            </h1>
            <SearchInput />
            <UserProfile />
        </header>
    );
};

export default Menu;
