import { images } from '../../assets/assets';

const ProjectDescription = () => {
    return (
      <section className="py-10 md:py-24 max-w-6xl mx-auto text-center w-full px-4">
        <h2 className="md:text-5xl text-3xl text-americanOrange-500 mb-14">O LearningLab</h2>
        <div className='flex md:flex-row flex-col-reverse justify-between items-center gap-16'> 
            <p className="text-gray-600 mb-8 text-xl text-start">
            O LearningLab (Laboratório de Ensino e Pesquisa de Tecnologias Alinhadas à Gestão do Conhecimento e Inovação em Processos de Software) 
            tem como objetivo contribuir para o processo de formação dos estudantes dos cursos de Ciência da Computação e Engenharia de Software.<br /><br />
            As atividades do LearningLab iniciaram em maio de 2020 com apenas três alunos voluntários juntamente com a coordenadora, Jacilane Rabelo.
            </p>
            
            <img 
            src={images.team} 
            alt="Equipe do LearningLab" 
            className="mx-auto rounded-lg w-[400px]"
            />
          </div>
      </section>
    );
  };

export default ProjectDescription;