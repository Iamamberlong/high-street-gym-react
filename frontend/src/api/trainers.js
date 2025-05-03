import axios from 'axios'
import { API_URL } from './api'

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/trainers`, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("trainers are here: ", response.data)
        return response.data.trainers

    } catch (error) {
        throw error.response?.data || error.message;
    }
}


