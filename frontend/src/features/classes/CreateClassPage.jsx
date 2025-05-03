import React, { useState, useEffect } from "react";
import * as Classes from "../../api/classes";
import PageLayout from "../../common/PageLayout";

import ClassCreate from "./ClassCreate"
import { useAuthentication } from "../authentication"; // Import your authentication hook


const CreateClassPage = () => {
    const [statusMessage, setStatusMessage] = useState("")
    const [user] = useAuthentication()
    console.log("user is: ", user)

    const handleClassAdded = () => {
        setStatusMessage("")
    }

    return (
        <PageLayout>
            <h1 className="text-2xl font-bold mb-2 text-center">Create a New Gym Class</h1>
            <ClassCreate onAdded={handleClassAdded} />
            {statusMessage && <p className="mt-2 text-green-500">{statusMessage}</p>}
        </PageLayout>
    )
 }

export default CreateClassPage