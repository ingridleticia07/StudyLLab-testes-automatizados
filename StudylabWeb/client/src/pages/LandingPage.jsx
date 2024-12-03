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
                        "What is Lorem Ipsum?", 
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum\n has been the industry's standard dummy text ever since the 1500s."
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