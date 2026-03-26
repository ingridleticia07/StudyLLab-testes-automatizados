import { images } from "../../assets/assets";
import StudentCard from "../Cards/StudentCard";


const AboutStudents = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full pb-40">
            <div className="flex flex-col items-center justify-center gap-8 w-full">
                <h2 className="md:text-5xl text-3xl text-center text-americanOrange-500 mb-14">Feito por estudantes <br /> para estudantes</h2>
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 overflow-x-auto gap-5 w-full px-4 pb-4 max-w-6xl mx-auto">
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutStudents;