import AboutHeader from "../components/AboutHeader/AboutHeader";
import AboutStudents from "../components/AboutStudents/AboutStudents";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import ProjectDescription from "../components/ProjectDescription/ProjectDescription";

const About = () => {
    return (
        <div className="bg-white min-h-screen w-full flex flex-col justify-between items-center">
            <main className="flex flex-col items-center min-w-full flex-grow w-full">
                <AboutHeader /> 
                <ProjectDescription />  
                <AboutStudents />          
            </main>
            <HomeFooter />
        </div>
    );
}

export default About;