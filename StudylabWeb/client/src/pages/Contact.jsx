import Navbar from "../components/NavBar/NavBar";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import ContactForm from "../components/ContactForm/ContactForm";

const Contact = () => {
    return (
        <div className="bg-white min-h-screen min-w-max w-full mx-auto flex flex-col justify-between items-center">
            <main className="flex flex-col items-center min-w-full flex-grow w-full">
                <Navbar />
                <div className="flex items-center justify-between w-[1200px] max-w-screen-xl pt-16 pb-28">
                    <h1 className="text-5xl text-americanOrange-400 text-left mt-10">Entre em contato com <br /> nossa equipe</h1>
                    <ContactForm />
                </div>
            </main>
            <HomeFooter />
        </div>
    );
};

export default Contact;