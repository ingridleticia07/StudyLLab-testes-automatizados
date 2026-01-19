import Navbar from "../components/NavBar/NavBar"
import HomeContent from "../components/HomeContent/HomeContent";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import HomeFeaturesSection from "../components/HomeFeaturesSection/HomeFeaturesSection";
import HomeMadeStudents from "../components/HomeMadeStudents/HomeMadeStudents";


const LandingPage = () => {
    return (
        <div className="min-h-screen items-center justify-between bg-white flex flex-col min-w-max w-full mx-auto"> 
            <main className="flex flex-col items-center min-w-full flex-grow w-full">
                <Navbar />
                <br />
                <HomeContent 
                    infoText={[
                        <>
                            O que é o StudyLab?
                        </>,
                        <>
                            O StudyLab é uma plataforma projetada para facilitar o compartilhamento e a discussão de conteúdos acadêmicos entre estudantes da UFC Russas.

                            <br /><br />

                            Nosso objetivo é criar uma comunidade colaborativa onde os alunos possam acessar materiais de estudo, trocar ideias e ajudar uns aos outros a alcançar o sucesso acadêmico.
                        </>
                    ]}
                />
                <HomeFeaturesSection/>
                <HomeMadeStudents/>
            </main>
            <HomeFooter />
        </div>
    );
};


export default LandingPage;