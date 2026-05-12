import { studentsImages } from "../../assets/assets";
import StudentCard from "../Cards/StudentCard";


const AboutStudents = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full pb-40">
            <div className="flex flex-col items-center justify-center gap-8 w-full">
                <h2 className="md:text-5xl text-3xl text-center text-americanOrange-500 mb-14">Feito por estudantes <br /> para estudantes</h2>
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 overflow-x-auto gap-5 w-full px-4 pb-4 max-w-6xl mx-auto">
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Pedro Lucas" image = {studentsImages.student18} role = "Tech Lead"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Sufia Costa" image = {studentsImages.student5} role = "UX Lead"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Pedro Matos" image = {studentsImages.student17} role = "Devops"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Daniel Oliveira" image = {studentsImages.student21} role = "QA Lead"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Kaio Fontenele" image = {studentsImages.student19} role = "Tech Lead"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Alana Oliveira" image = {studentsImages.student20} role = "Desenvolvedora"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Gabriel Ennos" image = {studentsImages.student8} role = "Desenvolvedor"/>
                    </div>
                    
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Diego Ribeiro" image = {studentsImages.student9} role = "Desenvolvedor"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Luan Roger" image = {studentsImages.student10} role = "Desenvolvedor"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Rachel Liberato" image = {studentsImages.student15} role = "UX/UI Designer"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Cecília de Oliveira" image = {studentsImages.student16} role = "UX/UI Designer"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Alberto Marinho" image = {studentsImages.student23} role = "Desenvolvedor"/>
                    </div>


                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Kennedy Balbino" image = {studentsImages.student14} role = "QA"/>
                    </div>
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Juliano Pinheiro" image = {studentsImages.student13} role = "QA"/>
                    </div>
                    
                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Livia Freitas" image = {studentsImages.student24} role = "QA"/>
                    </div>

                    <div className="shrink-0 w-40 md:w-64">
                        <StudentCard name= "Victor Ravel" image = {studentsImages.student22} role = "QA"/>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AboutStudents;