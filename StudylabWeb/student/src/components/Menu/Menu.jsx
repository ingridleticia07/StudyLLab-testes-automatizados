import SearchInput from '../Inputs/SearchInput';
import UserProfile from '../UserProfile/UserProfile';

const Menu = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 md:px-20 h-16 md:h-24 flex items-center justify-between">
      <h1 className="text-americanOrange-500 text-2xl md:text-4xl font-urbanist">
        Study<span className="font-bold">Lab</span>
      </h1>

      {/* Busca visível apenas em telas md+ */}
      <div className="hidden md:block flex-1 px-4">
        <SearchInput />
      </div>

      <UserProfile />
    </header>
  );
};

export default Menu;
