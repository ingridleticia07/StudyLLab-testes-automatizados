import HomeCard from "../Cards/HomeCard";
import {images} from "../../assets/assets";

const HomeFeaturesSection = () => {
  return (
    <section className="relative bg-americanOrange-500 rounded-2xl mb-8 mt-4 max-w-[90%] w-[1150px] mx-auto">
      <div className="grid gap-8 px-16 py-24">
        
        <div className="flex flex-col items-start gap-8">
          <div className="flex gap-8 items-start">
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
          </div>
          <div className="flex gap-8 itens-end justify-end pl-10">
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
          </div>
        </div>

        <div className="absolute right-[-50px] w-1/2 flex justify-center">
          <img
            src={images.laptop}
            alt="Laptop"
            className="max-w-[90%] md:max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
