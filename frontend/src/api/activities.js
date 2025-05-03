import axios from 'axios';
import { API_URL } from './api.js';

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/activities`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('API Response: ', response.data)
        return response.data.activities; // Adjust based on API response structure
    } catch (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }
}

export async function getByID(activityID) {
    try {
        const response = await axios.get(`${API_URL}/activities/${activityID}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.activity; // Adjust based on API response structure
    } catch (error) {
        console.error(`Error fetching activity with ID ${activityID}:`, error);
        throw error;
    }
}

export async function create(activity, authenticationKey) {
    try {
        const response = await axios.post(`${API_URL}/activities`, activity, {
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-KEY': authenticationKey
            }
        });
        return response.data.activity; // Adjust based on API response structure
    } catch (error) {
        console.error('Error creating activity:', error);
        throw error;
    }
}

export async function update(activity, authenticationKey) {
    try {
        const response = await axios.patch(`${API_URL}/activities`, activity, {
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-KEY': authenticationKey
            }
        });
        return response.data.activity; // Adjust based on API response structure
    } catch (error) {
        console.error('Error updating activity:', error);
        throw error;
    }
}

export async function remove(activityID, authenticationKey) {
    try {
        const response = await axios.delete(`${API_URL}/activities/${activityID}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-KEY': authenticationKey
            }
        });
        return response.data; // Adjust based on API response structure
    } catch (error) {
        console.error(`Error deleting activity with ID ${activityID}:`, error);
        throw error;
    }
}
