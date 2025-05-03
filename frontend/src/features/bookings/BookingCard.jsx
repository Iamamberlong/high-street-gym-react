import React from "react";

const BookingCard = ({ booking, onDelete, userRole }) => {
  const { id, activity_name, trainer_firstname, trainer_lastname, location_name, class_datetime } = booking;

  return (
    <div className="flex flex-col class-card shadow-md border-gray-600 bg-slate-100 rounded-lg p-4">
      <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
      <span className="class-list-data">{trainer_firstname} {trainer_lastname}</span>
      <span className="class-list-data text-blue-600">{location_name}</span>
      <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
      
      {userRole && (
        <button onClick={() => onDelete(id)} className="btn btn-danger mt-4 w-full max-w-xs bg-danger text-white border-0 bg-violet-400 text-white px-2 py-1 rounded self-center">
          Cancel
        </button>
      )}
    </div>
  );
};

export default BookingCard;
