import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

// Fetch all locations
export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/locations`, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("response.data.locations: ", response.data.locations)
        return response.data.locations; 

    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Fetch a single location by its ID
export async function getByID(locationID) {
    try {
        const response = await axios.get(`${API_URL}/locations/${locationID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.location; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Create a new location
export async function create(location, authenticationKey) {
    try {
        const response = await axios.post(
            `${API_URL}/locations`,
            location,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AUTH-KEY': authenticationKey
                }
            }
        );
        return response.data.location; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Update an existing location
export async function update(location, authenticationKey) {
    try {
        const response = await axios.patch(
            `${API_URL}/locations/${location.id}`,
            location,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AUTH-KEY': authenticationKey
                }
            }
        );
        return response.data.location; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Remove a location by its ID
export async function remove(locationID, authenticationKey) {
    try {
        const response = await axios.delete(
            `${API_URL}/locations/${locationID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AUTH-KEY': authenticationKey
                }
            }
        );
        return response.data; // Handle the response as needed
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
