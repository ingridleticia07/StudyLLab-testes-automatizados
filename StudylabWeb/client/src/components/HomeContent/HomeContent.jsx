import { Link } from 'react-router-dom';

const HomeContent = ({ infoText }) => {
  return (
    <section className="py-16 max-w-xs sm:max-w-xl md:max-w-2xl xl:max-w-6xl mx-auto text-center overflow-hidden">
      <h2 className="text-2xl sm:text-4xl md:text-6xl text-gray-600 mb-6">{infoText[0]}</h2>
      <p className="mt-2 text-base sm:text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">{infoText[1]}</p>
      <Link
        to="/sobre"
        className="mt-4 border-2 text-lg sm:text-xl lg:text-2xl border-americanOrange-500 bg-transparent text-americanOrange-500 px-4 py-4 rounded-full hover:bg-americanOrange-500 hover:text-white transition text-center inline-block"
      >Quero conhecer</Link>
    </section>
  );
};

export default HomeContent;