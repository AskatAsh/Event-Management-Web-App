import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Loading from "./../components/shared/Loading";

const dateRangeOptions = [
  { label: "Recent", value: "recent" },
  { label: "Current Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "Current Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
];

const AllEvents = () => {
  const [events, setEvents] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Filters
  const [searchTitle, setSearchTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [dateRange, setDateRange] = useState("recent");

  // Fetch all events (recent)
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    const eventsData = await fetch(
      `${import.meta.env.VITE_SERVER}/events`
    ).then((res) => res.json());
    setEvents(eventsData);
    setLoading(false);
  };

  // Debounced search by title
  useEffect(() => {
    if (searchTitle.trim() === "") {
      fetchAllEvents();
      return;
    }
    const handler = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/events/search?title=${searchTitle}`
      );
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTitle]);

  // DateTime input handler
  useEffect(() => {
    if (!dateTime) return;
    const fetchByDate = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("filterType", "custom_day");
      params.append("selectedDate", dateTime);

      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/events/filter?${params.toString()}`
      );
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    };
    fetchByDate();
  }, [dateTime]);

  // Date range select handler
  useEffect(() => {
    if (!dateRange || dateRange === "recent") {
      fetchAllEvents();
      return;
    }
    const fetchByRange = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("filterType", dateRange);

      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/events/filter?${params.toString()}`
      );
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    };
    fetchByRange();
  }, [dateRange]);

  // Reset filters
  const handleReset = () => {
    setSearchTitle("");
    setDateTime("");
    setDateRange("recent");
    fetchAllEvents();
  };

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
      {/* Search and Filter UI */}
      <form
        className="flex flex-wrap md:flex-row gap-3 mb-6 items-end"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          <label className="block text-sm mb-1">Search by Title</label>
          <input
            type="text"
            className="input input-bordered md:w-80"
            placeholder="Search events..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Select Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date Range</label>
          <select
            className="select select-bordered"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-outline"
          type="button"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </form>

      {loading ? (
        <div className="mt-20">
          <Loading />
        </div>
      ) : (
        <section className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {events.data && events.data.length > 0 ? (
            events.data.map((event, idx) => (
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
                      {event?.joinedUsers?.includes(user?.id) ||
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
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No events found.
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AllEvents;
