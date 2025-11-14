import HomeCard from "../Cards/HomeCard";
import {images} from "../../assets/assets";

const HomeFeaturesSection = () => {
  return (
    <section className="relative bg-americanOrange-500 rounded-2xl mb-3 mt-2 md:mb-8 md:mt-4 w-full max-w-80 xs:max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-[1150px] mx-auto">
      <div className="grid gap-8 px-4 py-6 xl:px-16 xl:py-24">
        
        <div className="flex flex-col lg:items-start gap-8">
          <div className="flex gap-6 md:gap-8 items-start">
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
          </div>
          <div className="flex gap-6 md:gap-8 items-end lg:pl-10">
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
            <HomeCard 
              info={["Nome da vantagem", "Lorem Ipsum is simply dummy text of the printing and typesetting industry."]}
            />
          </div>
        </div>

        <div className="hidden lg:absolute lg:top-1/2 -translate-y-1/2 xl:top-auto xl:translate-y-0 lg:right-[-35px] xl:right-[-50px] lg:w-[calc(56rem/2.4)] xl:w-[calc(1150px/2)] lg:flex xl:justify-center">
          <img
            src={images.laptop}
            alt="Laptop"
            className="md:max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturesSection;
