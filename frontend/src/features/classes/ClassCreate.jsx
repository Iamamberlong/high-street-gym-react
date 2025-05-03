import { useEffect, useState } from "react";
import * as Activities from "../../api/activities";
import * as Locations from "../../api/locations";
import * as Trainers from "../../api/trainers";
import * as GymClasses from "../../api/classes";

import { useAuthentication } from "../authentication";

export default function ClassCreate({ onAdded }) {
  const [user, login, logout] = useAuthentication();

  const [formData, setFormData] = useState({
    activity_id: "",
    location_id: "",
    gymClass_date: "",
    gymClass_time: "",
    gymClass_trainer: user.role=== "trainer" ? user.userID : "",
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  // Load activities
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    Activities.getAll().then((activities) => setActivities(activities));
    console.log("activities are: ", activities);
  }, []);

  // Load locations
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    Locations.getAll().then((locations) => setLocations(locations));
    console.log("lcoations are: ", locations);
  }, []);

  // Load trainers
  const [trainers, setTrainers] = useState([]);
  useEffect(() => {
    Trainers.getAll("trainer").then((trainers) => setTrainers(trainers));
    console.log("Trainers are:", trainers);
  }, []);

  // generateTimeOptions function
  const generateTimeOptions = () => {
    const times = [];
    let currentHour = 8;

    while (currentHour <= 20) {
      const hour = currentHour % 12 === 0 ? 12 : currentHour % 12;
      const amPm = currentHour < 12 ? "AM" : "PM";
      const timeString = `${hour.toString().padStart(2, "0")}:00 ${amPm}`;
      times.push(timeString);
      currentHour += 1;
    }

    return times;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.activity_id) newErrors.activity_id = "Activity is required.";
    if (!formData.location_id) newErrors.location_id = "Location is required.";
    if (!formData.gymClass_date) newErrors.gymClass_date = "Date is required.";
    if (!formData.gymClass_time) newErrors.gymClass_time = "Time is required.";
    if (!formData.gymClass_trainer) newErrors.gymClass_trainer = "Trainer is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function addGymClass(e) {
    e.preventDefault();
    setStatusMessage("");

    if (!validateForm()) {
      setStatusMessage("Please correct the errors above.");
      return;
    }

    setStatusMessage("Creating a gym class...");

    // Format the date and time correctly
    const [year, month, day] = formData.gymClass_date.split("-");
    const [time, amPm] = formData.gymClass_time.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert 12-hour time to 24-hour format
    if (amPm === "PM" && hours !== "12") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    if (amPm === "AM" && hours === "12") {
      hours = "00";
    }
    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");

    // Format dateTime string
    const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    // Prepare gym class data
    const gymClassData = {
      dateTime: dateTime,
      location_id: formData.location_id,
      activity_id: formData.activity_id,
      user_id: formData.gymClass_trainer,
    };
    console.log("Token before the GymClasses.create function is:", user.token);
    console.log("gymClassData:", gymClassData);

    GymClasses.create(gymClassData, user.token)
      .then((result) => {
        setStatusMessage(result.message);
        setFormData({
          activity_id: "",
          location_id: "",
          gymClass_date: "",
          gymClass_time: "",
          gymClass_trainer: user.role=== "trainer" ? user.userID : "",
        });

        if (typeof onAdded === "function") {
          onAdded();
        }
      })
      .catch((error) => {
        setStatusMessage(
          error.response.data.message || "Failed to create gym class"
        );
        console.error("Error:", error);
      });
  }

  return (
    <div className="flex items-center justify-center">
      <form className="flex-grow m-2 max-w-2xl" onSubmit={addGymClass}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-gray-800">Activity</span>
          </label>
          <select
            className="select select-bordered shadow-md bg-white "
            value={formData.activity_id}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                activity_id: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Activity
            </option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
          {errors.activity_id && (
            <p className="text-red-500 text-sm">{errors.activity_id}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-gray-800">Location</span>
          </label>
          <select
            className="select select-bordered shadow-md bg-white"
            value={formData.location_id}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                location_id: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.location_id && (
            <p className="text-red-500 text-sm">{errors.location_id}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-gray-800">Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered shadow-md bg-white w-full"
            value={formData.gymClass_date}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                gymClass_date: e.target.value,
              }))
            }
          />
          {errors.gymClass_date && (
            <p className="text-red-500 text-sm">{errors.gymClass_date}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-gray-800">Time</span>
          </label>
          <select
            className="select select-bordered shadow-md bg-white"
            value={formData.gymClass_time}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                gymClass_time: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Time
            </option>
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.gymClass_time && (
            <p className="text-red-500 text-sm">{errors.gymClass_time}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base text-gray-800">Trainer</span>
          </label>
          <select
            className="select select-bordered shadow-md bg-white"
            value={formData.gymClass_trainer}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                gymClass_trainer: e.target.value,
              }))
            }
          >
            {user.role === "trainer" ? (
              <option value={user.userID}>
                {user.firstName} {user.lastName}
              </option>
            ) : (
              <>
                <option value="" disabled>
                  Select Trainer
                </option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.user_id}>
                    {trainer.firstname} {trainer.lastname}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.gymClass_trainer && (
            <p className="text-red-500 text-sm">{errors.gymClass_trainer}</p>
          )}
        </div>
        <div className="my-2">
          <button className="btn btn-primary w-full mr-2 mt-10 bg-blue-500 text-fold text-white text-lg">Add</button>
          <label className="label">
            <span
              className={`label-text-alt text-center ${
                statusMessage.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {statusMessage}
            </span>
          </label>
        </div>
      </form>
    </div>
  );
}
