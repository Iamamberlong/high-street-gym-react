import React, { useState } from "react";
import * as Bookings from "../../api/bookings";
import * as GymClasses from "../../api/classes"; // Import GymClasses to use remove method

const ClassCard = ({ gymClass, userRole, userID }) => {
  const { id, activity_name, user_firstname, user_lastname, location_name, class_datetime, activity_duration, creatorId } = gymClass;

  const [bookingMessage, setBookingMessage] = useState('');
  const token = localStorage.getItem('jwtToken');

  // Handle booking submission
  const handleBooking = async () => {
    try {
      const booking = {
        user_id: userID,
        class_id: id,
        class_datetime: class_datetime,
        created_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      const response = await Bookings.create(booking, token);
      console.log("response in booking class is: ", response);
      if (response.status === 201) {
        setBookingMessage("You have successfully booked the class.");
      } else if (response.status === 409) {
        setBookingMessage("You have already booked this class."); 
      } else if (response.status === 422) {
        setBookingMessage("You have class at the same time.")
      } else if (response.status === 412) {
        setBookingMessage("You have to book two hours before the class.")
      }
      else {
        setBookingMessage("Something went wrong.");
      }
    } catch (error) {
      console.error("Booking error: ", error);
      setBookingMessage("An error occurred while booking the class.");
    }
  };

  // Handle canceling the class
  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this class?");
    if (confirmed) {
      try {
        await GymClasses.remove(id, token); 
        setBookingMessage("Class successfully canceled.");

      } catch (error) {
        console.error("Cancel error: ", error);
        setBookingMessage("An error occurred while canceling the class.");
      }
    }
  };

  return (
    <div className="flex flex-col class-card border-md border-0 border-gray-600 bg-slate-100 shadow-md rounded-lg p-4">
      <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
      <span className="class-list-data">{user_firstname} {user_lastname}</span>
      <span className="class-list-data text-blue-600">{location_name}</span>
      <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
      <span className="class-list-data text-sm">{activity_duration}</span>

      {userRole === 'member' && (
        <button onClick={handleBooking} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Book
        </button>
      )}

      {userRole === 'trainer' && creatorId === userID && (
        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
          Cancel
        </button>
      )}

      {bookingMessage && (
        <div className={`mt-4 p-2 rounded ${bookingMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {bookingMessage}
        </div>
      )}
    </div>
  );
};

export default ClassCard;