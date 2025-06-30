// import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Loading from "./../components/shared/Loading";

const AllEvents = () => {
  // const { events } = useLoaderData();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // get all events
  useEffect(() => {
    async function fetchEvents() {
      const eventsData = await fetch("http://localhost:10000/events").then(
        (res) => res.json()
      );
      setEvents(eventsData);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Join event handler using eventid and userid
  const joinEventHandler = async (eventId) => {
    if (!user?.id) return;

    const res = await fetch(
      `${import.meta.env.VITE_SERVER}/join-event/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // Update attendeeCount in the events state
      setEvents((prev) => ({
        ...prev,
        data: prev.data.map((event) =>
          event._id === eventId
            ? { ...event, attendeeCount: event.attendeeCount + 1 }
            : event
        ),
      }));
    } else {
      toast.warning(data.message || "You have already joined this event.", {
        position: "top-right",
        autoClose: 1500,
        transition: Bounce,
        theme: "dark",
      });
    }
  };

  return (
    <div>
      <title>EventZ | All Events</title>
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
                </ul>
                <p className="line-clamp-2 text-gray-300">
                  {event?.description}
                </p>
                <div className="flex items-center">
                  <p className="text-gray-400">
                    Attendee Count: {event?.attendeeCount}
                  </p>
                  <div className="card-actions justify-end">
                    {event?.joinedUsers.includes(user?.id) ||
                    event?.attendeeCount ? (
                      <button className="btn btn-outline">✔ Joined</button>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={() => joinEventHandler(event?._id)}
                      >
                        Join Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default AllEvents;
