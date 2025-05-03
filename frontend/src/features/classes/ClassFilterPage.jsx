import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as Classes from "../../api/classes";
import PageLayout from "../../common/PageLayout";
import { useAuthentication } from "../authentication";
import ClassCard from "./ClassCard"; 

const ClassFilterPage = () => {
  const { gymClassName, classDate } = useParams();
  const [classDetails, setClassDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthentication();
  const userRole = user?.role || "";
  const userID = user?.userID || "";

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Dropdown options
  const [locations, setLocations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch the specific classes for the selected gym class and date
        const data = await Classes.getByClassNameAndDate(gymClassName, classDate);
        setClassDetails(data);

        // Extract unique filter values from the fetched data
        const uniqueLocations = [...new Set(data.map(cls => cls.location_name))];
        const uniqueTrainers = [
          ...new Set(data.map(cls => `${cls.user_firstname} ${cls.user_lastname}`))
        ];
        const uniqueTimes = [
          ...new Set(data.map(cls => new Date(cls.class_datetime).toTimeString().split(" ")[0]))
        ];

        setLocations(uniqueLocations);
        setTrainers(uniqueTrainers);
        setTimes(uniqueTimes.sort());
      } catch (err) {
        console.error("Failed to fetch class details:", err);
        setError("Failed to fetch class details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gymClassName, classDate]); // Dependencies: gymClassName and classDate

  // Apply filters
  const applyFilters = (classes) => {
    return classes.filter(
      (gymClass) =>
        (selectedLocation === "" || gymClass.location_name === selectedLocation) &&
        (selectedTrainer === "" || `${gymClass.user_firstname} ${gymClass.user_lastname}` === selectedTrainer) &&
        (selectedTime === "" || new Date(gymClass.class_datetime).toTimeString().split(" ")[0] === selectedTime)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <PageLayout>
      <section className="class-details-container p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
         <span className="text-2xl text-blue-500">{gymClassName}</span>  Classes on <span className="text-2xl text-blue-500">{classDate}</span>
        </h2>

    
        <div className="flex flex-col m-4 items-center justify-center">
          <div className="flex flex-col m-2 w-full sm:w-1/3">
            <label className="label-text text-bold text-base text-gray-800">
              Location:
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="select select-bordered shadow-md bg-white w-full"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col m-2 w-full sm:w-1/3">
            <label className="label-text text-base text-gray-800">
              Trainer:
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                className="select select-bordered shadow-md bg-white w-full"
              >
                <option value="">All Trainers</option>
                {trainers.map((trainer) => (
                  <option key={trainer} value={trainer}>
                    {trainer}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col m-2 w-full sm:w-1/3">
            <label className="label-text text-base text-gray-800">
              Time:
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="select select-bordered shadow-md bg-white w-full"
              >
                <option value="">Any Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {classDetails.length > 0 ? (
          <ul className="class-details-list flex flex-wrap justify-center gap-4">
            {applyFilters(classDetails).map((classItem) => (
              <li key={classItem.id} className="mb-4 w-96">
                <ClassCard 
                  gymClass={classItem} 
                  userRole={userRole} 
                  userID={userID}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes available for {gymClassName} on {classDate}.</p>
        )}
      </section>
    </PageLayout>
  );
};

export default ClassFilterPage;
