import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../common/PageLayout";
import * as Classes from "../../api/classes";
import { useAuthentication } from "../authentication";

const ClassListPage = () => {
  const [classesByDay, setClassesByDay] = useState({});
  const [mondayOfThisWeek, setMondayOfThisWeek] = useState(null);
  const [dateOfMonday, setDateOfMonday] = useState(null);
  const [dateOfSunday, setDateOfSunday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
     
        const classesData = await Classes.getAll();
        console.log("Fetched classes data: ", classesData);

        setClassesByDay(classesData.classesByDay);
        setMondayOfThisWeek(classesData.mondayOfThisWeek);
        setDateOfMonday(classesData.dateOfMonday);
        setDateOfSunday(classesData.dateOfSunday);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleClassClick = (gymClassName, classDate) => {
    navigate(`/classes/${encodeURIComponent(gymClassName)}/${classDate}`);
  }

  return (
    <PageLayout>
      <section className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Classes Timetable
        </h2>
        <div className="flex justify-center">
          <p id="class-timetable" className="text-center">
            From{" "}
            <span className="class-date text-center text-2xl text-blue-500">
              {dateOfMonday}
            </span>{" "}
            to <span className="class-date text-2xl text-blue-500">{dateOfSunday}</span>
          </p>
        </div>

        {/* List Class Names for Each Day */}
        {daysOfWeek.map((day) => {
          const classesForDay = classesByDay[day] || [];

          const uniqueClassNames = [...new Set(classesForDay.map(gymClass => gymClass.activity_name))];

          const uniqueClasses = uniqueClassNames.map((gymClassName) => {
            const classDates = classesForDay
              .filter((gymClass) => gymClass.activity_name === gymClassName)
              .map((gymClass) => gymClass.class_datetime.split("T")[0]);
          
            const gymClassDate = [...new Set(classDates)][0]; // Get the first unique date
          
            return {
              gymClassName: gymClassName,
              gymClassDate: gymClassDate, // Pass only one date
            };
          });
          
          console.log(uniqueClasses);
          

          console.log('unique: ', uniqueClasses)

          return (
            <div key={day}>
              <h3 className="day-of-class text-xl font-semibold m-4">{day}</h3>
              {uniqueClasses.length > 0 ? (
                <ul className="class-names-list list-none ml-5">
                  {uniqueClasses.map((gymClass, index) => (
                    <li key={index} className="mb-4">
                      <button
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                        onClick={() => handleClassClick(gymClass.gymClassName, gymClass.gymClassDate)}
                      >
                        {gymClass.gymClassName}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No classes on this day</p>
              )}
            </div>
          );
        })}
      </section>
    </PageLayout>
  );
};

export default ClassListPage;
