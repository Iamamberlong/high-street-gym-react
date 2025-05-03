import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blogPost, onEdit, onDelete, userRole }) {
    
    const isAdminOrAuthorized = ['admin', 'member', 'trainer'].includes(userRole);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString); // Convert string to Date object
      
        // Extract date and time separately
        const formattedDate = date.toISOString().split('T')[0]; // '2024-04-25'
        const formattedTime = date.toTimeString().split(' ')[0]; // '08:48:29'
      
        return `${formattedDate} ${formattedTime}`; // Combine date and time
      };

    return (
        <div className="shadow-md rounded-lg bg-slate-100 overflow-hidden mb-4">
            <div className="p-4">
                <h3 className="text-l font-bold mb-2">
                    <Link to={`/blogs/${blogPost.id}`} className="text-gray-800 text-lg hover:underline">
                        {blogPost.title}
                    </Link>
                </h3>
             
                {(onEdit || onDelete) && isAdminOrAuthorized && (
                    <div className="mb-2">
                        {onEdit && (
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2 border-0 w-20"
                                onClick={() => onEdit(blogPost.id)}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="bg-violet-400 text-white px-2 py-1 rounded w-20"
                                onClick={() => onDelete(blogPost.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 text-sm">
                    <p className="flex-1 mb-2 sm:mb-0">{blogPost.firstname}</p>
                    <p className="flex-1 text-right">{formatDateTime(blogPost.post_datetime)}</p>
                </div>
            </div>
        </div>
    );
}
