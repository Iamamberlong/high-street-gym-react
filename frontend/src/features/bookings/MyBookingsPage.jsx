import { useEffect, useState } from "react";
import * as Bookings from "../../api/bookings";
import PageLayout from "../../common/PageLayout";
import BookingCard from "./BookingCard";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState(''); // New state for message
  const [user] = useAuthentication();
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const userRole = user?.role || '';

  useEffect(() => {
    const fetchBookings = async () => {
      if (user && token) {
        try {
          const bookings = await Bookings.getMyBookings(token);
          console.log("My bookings are: ", bookings);

          // Get today's date in ISO format
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to midnight

          // Filter bookings to include only today's and future bookings
          const filteredBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.class_datetime);
            return bookingDate >= today; // Compare dates
          });

          setMyBookings(filteredBookings); // Set the filtered bookings
        } catch (error) {
          console.error("Error fetching my bookings: ", error);
        }
      }
    };
    fetchBookings();
  }, [user, token]);

  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      try {
        await Bookings.remove(bookingId, token);
        setMyBookings(myBookings.filter(booking => booking.id !== bookingId));
        setMessage("Booking successfully canceled.");

        setTimeout(() => {
          setMessage(''); // Reset message after 5 seconds
        }, 5000)
      } catch (error) {
        console.error("Error canceling booking: ", error);
        setMessage("An error occurred while canceling the booking.");
      }
    }
  };

  return (
    <PageLayout>
     
      <div className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">My Bookings</h2>
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {myBookings.length > 0 ? (
            myBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={handleDelete}
                userRole={userRole}
              />
            ))
          ) : (
            <div className="text-center">You have not booked any classes yet.</div>
          )}
        </div>
      </div>

    </PageLayout>
  );
}
