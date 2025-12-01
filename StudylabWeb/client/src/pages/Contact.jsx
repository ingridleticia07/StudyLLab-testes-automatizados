import Navbar from "../components/NavBar/NavBar";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import ContactForm from "../components/ContactForm/ContactForm";

const Contact = () => {
    return (
        <div className="bg-white min-h-screen min-w-max w-full mx-auto flex flex-col justify-between items-center">
            <main className="flex flex-col items-center min-w-full flex-grow w-full">
                <Navbar />
                <div className="flex flex-col lg:flex-row items-center justify-between pt-2 pb-8 lg:pt-16 lg:pb-28 max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[1200px] gap-8 w-full">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl text-americanOrange-400 text-center lg:text-left mt-10 w-full">Entre em contato com <br /> nossa equipe</h1>
                    <ContactForm />
                </div>
            </main>
            <HomeFooter />
        </div>
    );
};

export default Contact;