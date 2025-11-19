import { studentsImages } from "../../assets/assets";

const HomeMadeStudents = () => {
  return (
    <section className="text-center items-center flex justify-between pt-16 pb-28 flex-col lg:flex-row max-w-80 xs:max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[1150px] w-full">
      <h3 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-gray-600 mb-8 text-center lg:text-start"> Feito por estudantes <br/> para estudantes </h3>

      <div className="flex flex-col items-center gap-2">
        {/*para alinhamento, valor de pr e pl = (valor do gap + valor de width da imagem) / 2 (usar valor próximo caso não exista)*/}
        <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 xl:gap-16 xs:pr-11 sm:pr-16 md:pr-20 xl:pr-24">
          <img src={studentsImages.student0} alt="Student 0" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student1} alt="Student 1" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student2} alt="Student 2" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
        </div>

        <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 xl:gap-16 xs:pl-11 sm:pl-14 md:pl-16 xl:pl-24">
          <img src={studentsImages.student3} alt="Student 3" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student4} alt="Student 4" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student5} alt="Student 5" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
        </div>

        <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 xl:gap-16 xs:pr-11 sm:pr-16 md:pr-20 xl:pr-24">
          <img src={studentsImages.student6} alt="Student 6" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student7} alt="Student 7" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student8} alt="Student 8" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
        </div>

        <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 xl:gap-16 xs:pl-11 sm:pl-14 md:pl-16 xl:pl-24">
          <img src={studentsImages.student9} alt="Student 9" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student10} alt="Student 10" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
          <img src={studentsImages.student11} alt="Student 11" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 xl:w-32 xl:h-32 rounded-full" />
        </div>
      </div>

    </section>
  );
};

export default HomeMadeStudents;
