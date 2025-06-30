import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loading from "./../components/shared/Loading";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  // handle delete event
  const handleDelete = async (eventId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/delete-event/${eventId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setEvents((prev) => ({
          ...prev,
          data: prev.data.filter((event) => event._id !== eventId),
        }));
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete the event.", "error");
      }
    }
  };

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
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
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
