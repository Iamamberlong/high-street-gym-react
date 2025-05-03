import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/classes`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return {
            classesByDay: response.data.classesByDay,
            mondayOfThisWeek: response.data.mondayOfThisWeek,
            dateOfMonday: response.data.dateOfMonday,
            dateOfSunday: response.data.dateOfSunday
        } // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



// /**
//  * Fetch classes for a specific date range.
//  * @param {string} startDate - The start date in the format YYYY-MM-DD.
//  * @param {string} endDate - The end date in the format YYYY-MM-DD.
//  * @returns {Promise<Object>} The API response data.
//  */
// export async function getByDateRange(startDate, endDate) {
//     try {
//       const response = await axios.get(`/api/classes/${startDate}/${endDate}`, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//       });

//       console.log("getByDateRange is: ", response)
//         return {
//             classesByDay: response.data.classesByDay,
//             mondayOfThisWeek: response.data.mondayOfThisWeek,
//             dateOfMonday: response.data.dateOfMonday,
//             dateOfSunday: response.data.dateOfSunday
//         } 
//     } catch (error) {
//       console.error('Failed to fetch classes:', error);
//       throw error;
//     }
//   };


export async function getByDateRange(startDate, endDate) {
    try {
        const response = await axios.get(`${API_URL}/classes/${startDate}/${(endDate)}`
    , {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByClassNameAndDate(gymClassName, classDate) {
    try {
        console.log("full url: ", `${API_URL}/classes/${gymClassName}/${classDate}`)
        console.log("gymClassName: ", gymClassName)
        console.log("classDate: ", classDate)
        const response = await axios.get(`${API_URL}/classes/${gymClassName}/${classDate}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("get by class name and date: ", response.data.classes)
        return response.data.classes; // Return the class data
       
    } catch (error) {
        throw error.response?.data || error.message; // Handle errors appropriately
    }
}


export async function getTop(amount) {
    try {
        const response = await axios.get(`${API_URL}/classes/top/${amount}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClasses; // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByUserID(userID) {
    try {
        const response = await axios.get(`${API_URL}/classes/user/${userID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClasses; // Ensure your backend responds with 'gymClasses'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getByID(gymClassID) {
    try {
        const response = await axios.get(`${API_URL}/classes/${gymClassID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.gymClass; // Ensure your backend responds with 'gymClass'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getMyClasses(token) {
    try {
        const response = await axios.get(`${API_URL}/classes/my-classes`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response.data: ", response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching my classes using token ', error)
        throw error
    }
}





export async function updateGymClass(gymClass, token) {
    try {
        const response = await axios.patch(
            `${API_URL}/classes`,
            gymClass,
            {
                headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
            }
        );
        return response.data.gymClass; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function remove(gymClassID, token) {
    try {
        const response = await axios.delete(
            `${API_URL}/classes/${gymClassID}`,
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

// export async function create(gymClassData, token) {
//     try {
//         const response = await axios.post(
//             `${API_URL}/classes`,
//             gymClassData,
//             {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         )
//         console.log("creating class in api: ", response.data)
//         return response.data
//     } catch (error) {
//         console.error('Error creating gym class: ', error)
//         throw error
//     }
// }


export async function create(gymClassData, token) {
    try {
        const response = await axios.post(
            `${API_URL}/classes`,
            gymClassData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Creating class response: ", response.data);
        return response.data;
    } catch (error) {
        // Log error response if available
        if (error.response) {
            console.error('Error response from API: ', error.response.data);
            // Handle specific cases based on status codes or messages
            if (error.response.status === 400) {
                // Example: handle specific error messages
                console.error('Error creating class: ', error.response.data.message);
                console.log("error message!!!!! ", error.response.data.message)
            }
        } else {
            console.error('Error creating gym class: ', error.message);
            console.log("error.message: ", error.message)
        }
        throw error; // Re-throw error after logging
    }
}
