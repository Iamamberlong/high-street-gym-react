import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

// Fetch all trainer profiles
export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/trainer_profiles`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.trainer_profiles; // Ensure your backend responds with 'trainer_profiles'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Fetch a single trainer profile by its ID
export async function getByID(profileID) {
    try {
        const response = await axios.get(`${API_URL}/trainer_profiles/${profileID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.trainer_profile; // Ensure your backend responds with 'trainer_profile'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Create a new trainer profile
export async function create(profile, authenticationKey) {
    try {
        const response = await axios.post(
            `${API_URL}/trainer_profiles`,
            profile,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AUTH-KEY': authenticationKey
                }
            }
        );
        return response.data.trainer_profile; // Ensure your backend responds with 'trainer_profile'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Update an existing trainer profile
export async function update(profile, authenticationKey) {
    try {
        const response = await axios.patch(
            `${API_URL}/trainer_profiles/${profile.id}`,
            profile,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-AUTH-KEY': authenticationKey
                }
            }
        );
        return response.data.trainer_profile; // Ensure your backend responds with 'trainer_profile'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

// Remove a trainer profile by its ID
export async function remove(profileID, authenticationKey) {
    try {
        const response = await axios.delete(
            `${API_URL}/trainer_profiles/${profileID}`,
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
