import React, { useState } from "react";

const DocumentViewModal = ({ filename, content, handleClose, onUpdate, onDelete }) => {
    const [docContent, setDocContent] = useState(content);

    const handleSave = () => {
        onUpdate(filename, docContent);
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
                        onClick={() => onDelete(filename)}
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
                        className="bg-grey-500 text-white px-4 py-2 rounded-md mr-2"
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
