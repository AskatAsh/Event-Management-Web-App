const Service = ({ service }) => {
  const { event_category, event_title, event_description, event_image } =
    service;

  return (
    <div
      className="overflow-hidden bg-[#1F2937] rounded shadow"
      data-aos="zoom-in"
      data-aos-duration="3000"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="relative">
          <a href="#" title="" className="block aspect-w-4 aspect-h-3">
            <img
              className="object-cover w-full h-full"
              src={event_image}
              alt="event cover image"
            />
          </a>

          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-gray-300 rounded-full opacity-90">
              {" "}
              {event_category}{" "}
            </span>
          </div>
        </div>
        <p className="mt-5 text-2xl font-semibold text-gray-200 flex-1">
          {" "}
          {event_title}{" "}
        </p>
        <p className="mt-4 text-base text-gray-400">{event_description}</p>
      </div>
    </div>
  );
};

export default Service;
