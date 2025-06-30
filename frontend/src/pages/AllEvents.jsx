import { useLoaderData } from "react-router";
import useAuth from "../hooks/useAuth";

const AllEvents = () => {
  const { events } = useLoaderData();
  const { user } = useAuth();
  console.log(user);

  return (
    <div>
      <title>EventZ | All Events</title>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {events.data.map((event, idx) => (
          <div
            key={event._id}
            className="card shadow-md bg-base-300 text-primary-content"
          >
            <div className="card-body">
              <h2 className="card-title text-white">
                <span>#{idx + 1}.</span> {event?.title}
              </h2>
              <ul className="flex flex-col text-gray-400">
                <li>
                  Posted by: <strong>{event?.name}</strong>
                </li>
                <li>Event Date: {new Date(event?.dateTime).toDateString()}</li>
                <li>Location: {event?.location}</li>
              </ul>
              <p className="line-clamp-2 text-gray-300">{event?.description}</p>
              <div className="flex items-center">
                <p className="text-gray-400">
                  Attendee Count: {event?.attendeeCount}
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-warning">Join Now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AllEvents;
