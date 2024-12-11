import { images } from "../../assets/assets";
import StudentCard from "../Cards/StudentCard";


const AboutStudents = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full pb-40">
            <div className="flex flex-col items-center justify-center gap-8 w-full">
                <h2 className="text-5xl text-center text-americanOrange-500 mb-14">Feito por estudantes <br /> para estudantes</h2>
                <div className="flex flex-row gap-10">
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                </div>
                <div className="flex flex-row gap-10">
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                    <StudentCard name= "Leila Nunes" image = {images.student} role = "Design"/>
                </div>
            </div>
        </div>
    );
};

export default AboutStudents;