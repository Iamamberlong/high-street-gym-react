import { useRef, useState } from "react"
import { API_URL } from "../../api/api"
import { useAuthentication } from "../authentication"


export function XMLUploader({ onUploadSuccess, uploadUrl, disabled = false }) {
    const [user] = useAuthentication()
    console.log('User in the XMLUploader: ', user)

    const [statusMessage, setStatusMessage] = useState("")

    // useRef is the react way of getting an element reference like below:
    // const uploadInput = document.getElementById("file-input")
    const uploadInputRef = useRef(null);

    async function uploadFile(e) {
        e.preventDefault()

        // Files is an array because the user could select multiple files
        // we choose to upload only the first selected file in this case.
        const file = uploadInputRef.current.files[0];

        if (!file) {
            setStatusMessage("No file selected. Please select an XML file.")
            return 
        }

        if (file.type !=="text/xml" && file.type !== "application/xml") {
           setStatusMessage("Invalid file type. Please upload a valid XML file.") 
        }

        // Fetch expects multi-part form data to be provided
        // inside a FormData object.  
        const formData = new FormData()
        formData.append("xml-file", file)

        const token = localStorage.getItem("jwtToken");

        fetch(API_URL + uploadUrl,
            {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            })
            .then(res => res.json())
            .then(APIResponse => {
                setStatusMessage(APIResponse.message)
                // clear the selected file
                uploadInputRef.current.value = null
                // Notify of successful upload
                if (typeof onUploadSuccess === "function") {
                    onUploadSuccess()
                }
            })
            .catch(error => {
                setStatusMessage("Upload failed - " + error)
            })
    }
           
    

    return (
        <div className="mb-6 border p-4 rounded-md shadow-sm">
            <form className="flex flex-col m-4 max-w-2xl" onSubmit={uploadFile}>
                <div className="form-control flex justify-center">
                    <label className="label">
                        <span className="label-text text-bold text-gray-800">XML File Import</span>
                    </label>
                    <input
                        ref={uploadInputRef}
                        type="file"
                        disabled={disabled}
                        className="file-input file-input-bordered file-input-primary mb-2 bg-white "
                    />
                    <button
                        disabled={disabled}
                        className="btn btn-primary bg-blue-500 text-base text-white"
                    >
                        Upload
                    </button>
                    <label className="label mt-2">
                        <span className="text-red-500 text-sm">{statusMessage}</span>
                    </label>
                </div>
            </form>
        </div>
    )
}