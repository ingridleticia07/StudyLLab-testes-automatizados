const HomeCard = ({ info, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-3 md:p-4 w-full h-full max-w-[160px] sm:max-w-[200px] md:max-w-56 mx-auto relative">
      <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-300 rounded-full absolute top-3 left-3 md:top-4 md:left-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-10 md:mt-12">
        <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-600 mb-1 md:mb-2">{info[0]}</h3>
        <p className="text-xs md:text-sm text-gray-600">{info[1]}</p>
      </div>
    </div>
  );
};
export default HomeCard;
