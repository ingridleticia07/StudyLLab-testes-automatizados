import HomeCard from "../Cards/HomeCard";
import {images} from "../../assets/assets";
import{CloudDownload, Library, Search, Users } from 'lucide-react';

const HomeFeaturesSection = () => {
  return (
    <section className="relative bg-americanOrange-500 rounded-2xl mb-3 mt-2 md:mb-8 md:mt-4 w-full max-w-80 xs:max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[1150px] mx-auto">
      <div className="grid gap-8 px-4 py-6 xl:px-16 xl:py-24">
        
        <div className="flex flex-col lg:items-start gap-8">
          <div className="flex gap-6 md:gap-8 items-stretch">
            <HomeCard
              icon={<CloudDownload  className="w-6 h-6 text-slate-700"/>}
              info={["Compartilhamento de Arquivos", "Faça o upload e baixe provas antigas, resumos e trabalhos. Uma rede colaborativa para você ajudar e ser ajudado pelos colegas de curso."]}
            />
            <HomeCard 
              icon={<Library className="w-6 h-6 text-slate-700"/>}
              info={["Organização por Disciplinas", "Encontre rapidamente o material que você precisa filtrando direto pelas matérias da grade curricular. Tudo separado para otimizar seu tempo de estudo."]}
            />
          </div>
          <div className="flex gap-6 md:gap-8 items-stretch lg:pl-10">
            <HomeCard
              icon={<Search className="w-6 h-6 text-slate-700"/>} 
              info={["Busca por Tópicos", "Navegue por assuntos e módulos específicos dentro de cada matéria, facilitando a busca por listas de exercícios focadas para a sua próxima prova."]}
            />
            <HomeCard
              icon={<Users className="w-6 h-6 text-slate-700"/>} 
              info={["Comunidade de Estudos", "Feito de aluno para aluno. Centralizamos os materiais que você precisa para a sua graduação no campus, focando em colaboração e repasse de conhecimento."]}
            />
          </div>
        </div>

        <div className="hidden lg:absolute lg:top-1/2 -translate-y-1/2 xl:top-auto xl:translate-y-0 lg:right-[-35px] xl:right-[-50px] lg:w-[calc(56rem/2.5)] xl:w-[calc(1150px/2)] lg:flex xl:justify-center">
          <div className="relative w-full"> 
            <img
            src={images.laptop}
            alt="Laptop"
            className="md:max-w-full h-auto"
            />
    
            <img 
            src={images.Disciplinas} 
            alt="StudyLab Preview" 
            className="absolute top-[6.5%] left-[12.3%] w-[75.3%] h-[78%] object-cover rounded-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
