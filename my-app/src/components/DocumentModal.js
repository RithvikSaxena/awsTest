import React, { useState } from "react";
import axios from "axios";

const DocumentModal = ({ handleOpen }) => {
    const [filename, setFilename] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        try {
            await axios.post(
                "http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/create",
                { filename, content },
                { headers: { 'Content-Type': 'application/json' } }
            );
            handleOpen(); // Close modal on successful submission
        } catch (error) {
            console.error("Failed to save document:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-lg font-semibold mb-4">New Document</h2>
                <input
                    type="text"
                    placeholder="Document Name"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-md"
                />
                <textarea
                    placeholder="Document Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-md"
                    rows="6"
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleOpen}
                        className="mr-4 bg-gray-300 p-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Save Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;
