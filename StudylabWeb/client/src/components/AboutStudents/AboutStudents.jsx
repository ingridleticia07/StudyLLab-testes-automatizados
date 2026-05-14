import { studentsImages } from "../../assets/assets";
import StudentCard from "../Cards/StudentCard";

const teams = [
  {
    title: "Desenvolvimento",
    members: [
      {
        name: "Pedro Lucas",
        image: studentsImages.student18,
        role: "Tech Lead",
      },
      {
        name: "Kaio Fontenele",
        image: studentsImages.student19,
        role: "Tech Lead",
      },
      {
        name: "Alana Oliveira",
        image: studentsImages.student20,
        role: "Desenvolvedora",
      },
      {
        name: "Gabriel Ennos",
        image: studentsImages.student8,
        role: "Desenvolvedor",
      },
      {
        name: "Diego Ribeiro",
        image: studentsImages.student9,
        role: "Desenvolvedor",
      },
      {
        name: "Luan Roger",
        image: studentsImages.student10,
        role: "Desenvolvedor",
      },
      {
        name: "Alberto Marinho",
        image: studentsImages.student23,
        role: "Desenvolvedor",
      },
    ],
  },
  {
    title: "UI/UX",
    members: [
      {
        name: "Sufia Costa",
        image: studentsImages.student5,
        role: "UX Lead",
      },
      {
        name: "Rachel Liberato",
        image: studentsImages.student15,
        role: "UX/UI Designer",
      },
      {
        name: "Cecília de Oliveira",
        image: studentsImages.student16,
        role: "UX/UI Designer",
      },
    ],
  },
  {
    title: "DevOps",
    members: [
      {
        name: "Pedro Matos",
        image: studentsImages.student17,
        role: "DevOps",
      },
    ],
  },
  {
    title: "QA",
    members: [
      {
        name: "Daniel Oliveira",
        image: studentsImages.student21,
        role: "QA Lead",
      },
      {
        name: "Kennedy Balbino",
        image: studentsImages.student14,
        role: "QA",
      },
      {
        name: "Juliano Pinheiro",
        image: studentsImages.student13,
        role: "QA",
      },
      {
        name: "Livia Freitas",
        image: studentsImages.student24,
        role: "QA",
      },
      {
        name: "Victor Ravel",
        image: studentsImages.student22,
        role: "QA",
      },
    ],
  },
];

const AboutStudents = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full pb-40">
      <div className="flex flex-col items-center justify-center gap-16 w-full">
        <h2 className="md:text-5xl text-3xl text-center text-americanOrange-500">
          Feito por estudantes <br /> para estudantes
        </h2>

        {teams.map((team) => (
          <div
            key={team.title}
            className="flex flex-col items-center gap-8 w-full"
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">
              {team.title}
            </h3>

            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 overflow-x-auto gap-5 w-full px-4 pb-4 max-w-6xl mx-auto">
              {team.members.map((member) => (
                <div
                  key={member.name}
                  className="shrink-0 w-40 md:w-64"
                >
                  <StudentCard
                    name={member.name}
                    image={member.image}
                    role={member.role}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutStudents;