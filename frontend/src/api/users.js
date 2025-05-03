import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

const getAuthToken = () => localStorage.getItem('jwtToken');

export async function login(email, password) {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function logout() {
    const token = localStorage.getItem('jwtToken');
    console.log('API logout called with token:', token);
    try {
        const response = await axios.post(
            `${API_URL}/logout`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("response.data is: ",  response.data)
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getAllUsers() {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get(
            `${API_URL}/users`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.users;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



export async function getMyProfile() {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get(
            `${API_URL}/my-profile`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("response.data.user: ", response.data.user)
        return response.data.user;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



export async function update(userID, updatedProfileData) {
    const token = localStorage.getItem('jwtToken');

    const dataToSend = {
        userID, 
        ...updatedProfileData, 
    };
    console.log("userID sending to the backend: ", userID)
    try {
        const response = await axios.patch(
            `${API_URL}/my-profile`,
            dataToSend,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log("updated user in API: ", response.data)
        return response.data;
    } catch (error) {
        console.log("error.message is: ", error.message)
        throw error.response?.data || error.message;
    }
}

export async function create(user) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.post(
            `${API_URL}/users`,
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || error.message)
        } else {
            throw new Error(error.message || " An unexpected error occurred.")
        }      
    }
}

export async function deleteByID(userID) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.delete(
            `${API_URL}/users/${userID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function registerUser(user) {
    try {
        const response = await axios.post(
            `${API_URL}/register`,
            user,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getUserByRole(role) {
    const token = localStorage.getItem('jwtToken');
    try {
        const response = await axios.get(
            `${API_URL}/users/role/${role}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.users; // Adjust based on the actual API response
    } catch (error) {
        throw error.response?.data || error.message;
    }
}
