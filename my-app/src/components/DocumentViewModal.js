import React, { useState, useEffect } from "react";
import axios from "axios";

// Utility function to get the base URL (replace this with your actual implementation)
const getBaseUrl = async () => {
    try {
        const response = await axios.get("URL_TO_GET_SECRET"); // Replace with your API endpoint to fetch the secret
        return response.data.baseUrl; // Adjust based on the response structure
    } catch (error) {
        console.error("Failed to fetch base URL:", error);
        throw error; // Propagate the error
    }
};

const DocumentViewModal = ({ filename, content, handleClose, onUpdate, onDelete }) => {
    const [docContent, setDocContent] = useState(content);
    const [baseUrl, setBaseUrl] = useState("");
    const token = localStorage.getItem('token');

    // Fetch the base URL when the component mounts
    useEffect(() => {
        const fetchBaseUrl = async () => {
            try {
                const url = await getBaseUrl();
                setBaseUrl(url);
            } catch (error) {
                console.error("Error fetching base URL:", error);
            }
        };

        fetchBaseUrl();
    }, []);

    const handleSave = async () => {
        try {
            await axios.put(
                `${baseUrl}/documents/update`, // Use the fetched base URL for updating
                { filename, content: docContent },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            onUpdate(filename, docContent); // Call the passed onUpdate function after saving
        } catch (error) {
            console.error("Failed to save document:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(
                `${baseUrl}/documents/delete`, // Use the fetched base URL for deleting
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: { filename } // Include the filename in the request body
                }
            );
            onDelete(filename); // Call the passed onDelete function after deleting
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-1/3">
                <h1 className="text-lg font-bold mb-4">{filename}</h1>
                <textarea
                    className="w-full h-60 p-2 border rounded-md"
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                />
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="bg-grey-500 text-white px-4 py-2 rounded-md"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewModal;
