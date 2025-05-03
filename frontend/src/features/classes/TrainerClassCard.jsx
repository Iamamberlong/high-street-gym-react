import React, { useState, useEffect } from "react";
import * as Bookings from "../../api/bookings";
import * as GymClasses from "../../api/classes"; 

const TrainerClassCard = ({ gymClass, userRole, userID }) => {
  const { id, activity_name, user_firstname, user_lastname, location_name, class_datetime, activity_duration, trainer_user_id } = gymClass;

  const [bookingMessage, setBookingMessage] = useState('');
  const [memberCount, setMemberCount] = useState(0)
  const [membersList, setMembersList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchBookingData = async () => {
        try {
            const members = await Bookings.getMembersByClassId(id, token)
            if (members.length > 0) {
                setMembersList(members)
                setMemberCount(members.length)
            } else {
                setMembersList([])
                setMemberCount(0)
            }
        } catch (error) {
            console.error("Error fetching booking data: ", error)
            setMembersList([])
            setMemberCount(0)
        }
    }
    fetchBookingData()
  }, [id, token])

  useEffect(() => {
    console.log("Updated members list: ", membersList);
  }, [membersList]);
  

  // Handle booking submission
  const handleBooking = async () => {
    try {
      const booking = {
        user_id: userID,
        class_id: id,
        created_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      const response = await Bookings.create(booking, token);
      console.log("response in booking class is: ", response);
      if (response.status === 201) {
        setBookingMessage("You have successfully booked the class.");
      } else if (response.status === 409) {
        setBookingMessage("You have already booked this class or you already have a class at this time.");
      } else {
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
    <div className="flex flex-col class-card border border-gray-600 bg-slate-100 shadow-md rounded-lg border-0 p-4">
      <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
      <span className="class-list-data">{user_firstname} {user_lastname}</span>
      <span className="class-list-data text-blue-600">{location_name}</span>
      <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
      <span className="class-list-data text-sm">{activity_duration}</span>
  
      <p>Total Members Booked: {memberCount}</p>
  
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Member List
      </button>
 
  
      {/* Button to cancel the class */}
      {userRole === 'trainer' && trainer_user_id === userID ? (
        <button
          onClick={handleCancel}
          className="bg-violet-400 text-white px-4 py-2 rounded mt-2"
        >
          Cancel Class
        </button>
      ) : (
        <p>You do not have permission to cancel this class.</p>
      )}
  
  {isModalOpen && (
  <div className="modal modal-open bg-slate-100">
    <div className="modal-box bg-slate-100">
      <h2 className="font-bold text-lg text-center">Member list</h2>

      {Array.isArray(membersList) && membersList.length > 0 ? (
        <ol className="my-4 list-decimal pl-5">
          {membersList.map((member, index) => (
            <li key={index}>
              {member.member_firstname} {member.member_lastname}
            </li>
          ))}
        </ol>
      ) : (
        <p>No members booked yet.</p>
      )}

      <div className="modal-action">
        <button className="btn bg-violet-400 text-white border-0 h-10" onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}

  
      {bookingMessage && (
        <div className={`mt-4 p-2 rounded ${bookingMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {bookingMessage}
        </div>
      )}
    </div>
  );
  
  
};

export default TrainerClassCard;
