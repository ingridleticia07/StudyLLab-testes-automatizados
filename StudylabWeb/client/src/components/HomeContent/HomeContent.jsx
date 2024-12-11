import { Link } from 'react-router-dom';

const HomeContent = ({ infoText }) => {
    return (
      <section className="text-center py-16">
        <h2 className="text-5xl text-gray-600 mb-6">{infoText[0]}</h2>
        <p className="text-gray-600 mb-8 whitespace-pre-line">{infoText[1]}</p>
        <Link
          to="/sobre"
          className="mt-4 border-2 text-xl border-americanOrange-500 bg-transparent text-americanOrange-500 px-4 py-4 rounded-full hover:bg-americanOrange-500 hover:text-white transition text-center inline-block"
        >Quero conhecer</Link>
      </section>
    );
};

export default HomeContent;