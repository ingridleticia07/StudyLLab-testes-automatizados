import NavBar from "../NavBar/NavBar";


const AboutHeader = () => {
  return (
    <header className="bg-americanOrange-500 text-white text-center rounded-b-3xl  pb-10 min-w-full">
      <div className="flex flex-col items-center min-w-full flex-grow w-full">
        <NavBar /> 
      </div>
      <div className="pb-10 pt-16 text-center">
        <h1 className="text-4xl mb-4">Sobre o projeto</h1>
        <p className="text-xl">Conheça a nossa equipe de idealizadores e nossas missões</p>
      </div>
    </header>
  );
};

export default AboutHeader;
