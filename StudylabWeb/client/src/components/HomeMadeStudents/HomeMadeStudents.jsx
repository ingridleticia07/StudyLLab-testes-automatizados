import { studentsImages } from "../../assets/assets";

const HomeMadeStudents = () => {
    return (
      <section className="text-center items-center flex justify-between pt-16 pb-28">
        <h3 className="text-5xl text-gray-600 mb-8 text-start"> Feito por estudantes <br /> para estudantes </h3>
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center gap-16">
            <img src={studentsImages.student0} alt="Student 0" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student1} alt="Student 1" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student2} alt="Student 2" className="w-32 h-32 rounded-full" />
          </div>
          <div className=" pl-48 flex justify-center gap-16">
            <img src={studentsImages.student3} alt="Student 3" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student4} alt="Student 4" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student5} alt="Student 5" className="w-32 h-32 rounded-full" />
          </div>
          <div className="flex justify-center gap-16">
            <img src={studentsImages.student6} alt="Student 6" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student7} alt="Student 7" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student8} alt="Student 8" className="w-32 h-32 rounded-full" />
          </div>
          <div className="pl-48 flex justify-center gap-16">
            <img src={studentsImages.student9} alt="Student 9" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student10} alt="Student 10" className="w-32 h-32 rounded-full" />
            <img src={studentsImages.student11} alt="Student 11" className="w-32 h-32 rounded-full" />
          </div>
        </div>
            
      </section>
    );
  };
  
  export default HomeMadeStudents;
  