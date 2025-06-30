import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import Swal from "sweetalert2";

const UpdateEvent = () => {
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: state?.title || "",
      name: state?.name || "",
      dateTime: state?.dateTime ? state.dateTime.slice(0, 16) : "",
      location: state?.location || "",
      description: state?.description || "",
      attendeeCount: state?.attendeeCount || 0,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state) {
      reset({
        title: state.title || "",
        name: state.name || "",
        dateTime: state.dateTime ? state.dateTime.slice(0, 16) : "",
        location: state.location || "",
        description: state.description || "",
        attendeeCount: state.attendeeCount || 0,
      });
    }
  }, [state, reset]);

  const onSubmit = async (data) => {
    const eventData = {
      ...data,
      attendeeCount: Number(data.attendeeCount || 0),
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER}/update-event/${state._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await res.json();
      setLoading(false);

      if (result.success) {
        Swal.fire("Success!", "Event updated successfully!", "success");
        reset();
      } else {
        Swal.fire("Error!", result.message || "Something went wrong", "error");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire("Error!", error.message || "Failed to update event", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-base-200 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="label">
            <span className="label-text">Event Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter event title"
            className="input input-bordered focus:outline-none w-full"
            {...register("title", { required: "Event title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="label">
            <span className="label-text">Name (Who Posted)</span>
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="input input-bordered focus:outline-none w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Date and Time */}
        <div>
          <label className="label">
            <span className="label-text">Date and Time</span>
          </label>
          <input
            type="datetime-local"
            className="input input-bordered focus:outline-none w-full"
            {...register("dateTime", { required: "Date and time is required" })}
          />
          {errors.dateTime && (
            <p className="text-red-500 text-sm">{errors.dateTime.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Event location"
            className="input input-bordered focus:outline-none w-full"
            {...register("location", { required: "Location is required" })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered focus:outline-none w-full"
            placeholder="Write something about the event"
            rows={3}
            {...register("description", {
              required: "Description is required",
            })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Attendee Count (optional, default 0) */}
        <div>
          <label className="label">
            <span className="label-text">Attendee Count (optional)</span>
          </label>
          <input
            type="number"
            placeholder="0"
            className="input input-bordered focus:outline-none w-full"
            {...register("attendeeCount")}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-warning w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
