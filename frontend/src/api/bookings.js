import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/bookings`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.bookings; // Ensure your backend responds with 'bookings'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByID(bookingID) {
    try {
        const response = await axios.get(`${API_URL}/bookings/${bookingID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.booking; // Ensure your backend responds with 'booking'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function create(booking, token) {
    try {
        const response = await axios.post(
            `${API_URL}/bookings/booking-confirmation`,
            booking,
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return {
            ...response.data,
            status: response.status
        }

    } catch (error) {
        if (error.response) {
            return {
                ...error.response.data,
                status: error.response.status
            }
        } else {
            return {
                status: 500, message: error.message
            }
        }
    }
}

export async function update(booking) {
    try {
        const response = await axios.patch(
            `${API_URL}/bookings`,
            booking,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data.booking; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function remove(bookingID, token) {
    try {
        const response = await axios.delete(
            `${API_URL}/bookings/my-bookings/${bookingID}`,
            {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 }
            }
        );
        return response.data; // Handle the response as needed
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


export async function getMyBookings(token) {
    try {
        const response = await axios.get(`${API_URL}/my-bookings`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response.data.blogs: ", response.data.myBookings)
        return response.data.myBookings
    } catch (error) {
        console.error('Error fetching my bookings using token ', error)
        throw error
    }
}

export async function getMembersByClassId(classId, token) {
    try {
        const response = await axios.get(`${API_URL}/bookings/${classId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })
        console.log("members are: ", response.data.members)
        return response.data.members
    } catch (error) {
        console.error('Error fetching members using token', error)
    }
}

