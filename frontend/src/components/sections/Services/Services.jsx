import { services } from "../../../constants";
import Service from "./Service";

const Services = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Our Popular Events
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-400 lg:mx-0">
              Discover a variety of expertly managed events designed to create
              unforgettable experiences for every occasion.
            </p>
          </div>
        </div>

        <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 md:grid-cols-2 md:max-w-full xl:grid-cols-3 xl:max-w-full">
          {services.map((service) => (
            <Service key={service.id} service={service}></Service>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
