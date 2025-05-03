import axios from 'axios';
import { API_URL } from './api'; // Ensure this path is correct

export async function getAll() {
    try {
        const response = await axios.get(`${API_URL}/blogs`, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("responses in blogs getAll: ", response)
        return response.data.blogs; 
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getBySearchTerm(searchTerm) {
    try {
        const res = await axios.get(`${API_URL}/blogs/`, {
            params: {search_term: searchTerm},
            headers: {'Content-Type': 'application/json'}
        })
        return res.data.blogs
    } catch (error) {
        throw error.res?.data || error.message
    }
}

export async function getByIdToEdit(blogID, token) {
    try {
        const response = await axios.get(`${API_URL}/blogs/edit/${blogID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response.data.blogs: ", response.data.blog)
        return response.data.blog
    } catch (error) {
        console.error('Error fetching my blogs using token ', error)
        throw error
    }
}


export async function getById(blogID) {
    try {
        const response = await axios.get(`${API_URL}/blogs/${blogID}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("response.data.blog", response.data.blog)
        return response.data.blog; 
        
    } catch (error) {
        throw error.response?.data || error.message;
    }
}



export async function getTop(amount) {
    try {
        const response = await axios.get(`${API_URL}/blogs/top/${amount}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.blogs;
    } catch (error) {
        // Handle the error according to your application's needs
        console.error('Error fetching top blogs:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function getMyBlogs(token) {
    try {
        const response = await axios.get(`${API_URL}/my-blogs`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("response.data.blogs: ", response.data.blogs)
        return response.data.blogs
    } catch (error) {
        console.error('Error fetching my blogs using token ', error)
        throw error
    }
}

export async function create(blog, token) {
    try {
        const response = await axios.post(
            `${API_URL}/blogs`,
            blog,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return  response.data
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function update(id, blog, token) {
    try {
        const response = await axios.put(
            `${API_URL}/blogs/edit/${id}`,
            blog,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data.blog; // Ensure your backend responds with 'blog'
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function remove(blogID, token) {
    try {
        const response = await axios.delete(
            `${API_URL}/blogs/${blogID}`,
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

