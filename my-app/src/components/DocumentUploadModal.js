import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../utils/Context";

const DocumentUploadModal = ({ handleOpen }) => {
    const { user } = useAuth();
    const [file, setFile] = useState(null); // To store selected file

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the selected file
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("document", file); // Attach the file to the FormData
        formData.append("email", user.email); // Attach user email

        try {
            const result = await axios.post(
                "http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Specify form-data for file uploads
                    },
                }
            );
            console.log(result);
            handleOpen();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        handleOpen();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="w-1/2 bg-slate-800 p-6 rounded shadow-md">
                <h2 className="text-white text-xl font-bold mb-4">Upload Document</h2>
                <form>
                    <div className="mb-4 mt-4">
                        <label className="block text-white">Select Document</label>
                        <input
                            type="file"
                            name="document"
                            className="w-full p-2 border bg-slate-900 border-gray-600 rounded mt-1 text-white"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-slate-500 text-white px-4 py-2 rounded mr-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleSubmit}
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUploadModal;
