// import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "./../components/shared/Loading";

const MyEvents = () => {
  // const { events } = useLoaderData();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    async function fetchEvents() {
      const eventsData = await fetch(
        `${import.meta.env.VITE_SERVER}/my-events/${user?.id}`
      ).then((res) => res.json());
      setEvents(eventsData);
      setLoading(false);
    }
    fetchEvents();
  }, [user]);

  return (
    <div>
      <title>EventZ | My Events</title>
      {loading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : (
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
                  <li>
                    Event Date: {new Date(event?.dateTime).toDateString()}
                  </li>
                  <li>Location: {event?.location}</li>
                  <li>Attendee Count: {event?.attendeeCount}</li>
                </ul>
                <p className="line-clamp-2 text-gray-300">
                  {event?.description}
                </p>
                <div className="card-actions justify-end">
                  <Link
                    to={`/update-Event/${event._id}`}
                    state={event}
                    className="btn btn-warning"
                  >
                    Update
                  </Link>
                  <button className="btn btn-error">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MyEvents;
