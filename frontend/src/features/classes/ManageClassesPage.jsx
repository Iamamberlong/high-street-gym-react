import React, { useState, useEffect } from "react";
import * as Classes from "../../api/classes";
import { useAuthentication } from "../authentication"; 

const ManageClassPage = () => {
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({ activity: "", trainer: "", location: "", class_date: "", class_time: "" });
    const [selectedClass, setSelectedClass] = useState(null);
    const [user] = useAuthentication();
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await Classes.getAll();
                setClasses(data.classesByDay);
            } catch (error) {
                console.error("Error fetching classes:", error);
                setError("Failed to fetch classes");
            }
        };

        fetchClasses();
    }, []);

    const handleCreate = async () => {
        try {
            await Classes.createClass({ ...form, action: 'create' }, token);
            setSuccess("Class created successfully");
            // Refetch classes if needed
        } catch (error) {
            setError("Failed to create class");
        }
    };

    const handleUpdate = async () => {
        try {
            await Classes.updateClass({ ...form, action: 'update' }, token);
            setSuccess("Class updated successfully");
            // Refetch classes if needed
        } catch (error) {
            setError("Failed to update class");
        }
    };

    const handleDelete = async (classId) => {
        try {
            await Classes.deleteClass(classId, token);
            setSuccess("Class deleted successfully");
            // Refetch classes if needed
        } catch (error) {
            setError("Failed to delete class");
        }
    };

    return (
        <div>
            <h1>Manage Classes</h1>
            {/* Form and class management logic here */}
            {classes.map(gymClass => (
                <ClassCard
                    key={gymClass.id}
                    gymClass={gymClass}
                    userRole={user?.role}
                    userID={user?.userID}
                    onEdit={handleUpdate}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default ManageClassPage;
