const HomeCard = ({ info, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 max-w-44 max-h-[90vw] md:max-w-56 mx-auto relative">
      <div className="w-9 h-9 bg-gray-300 rounded-full absolute top-4 left-4 flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-12">
        <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">{info[0]}</h3>
        <p className="text-xs md:text-sm text-gray-600">{info[1]}</p>
      </div>
    </div>
  );
};
export default HomeCard;
