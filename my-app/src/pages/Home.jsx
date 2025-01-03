import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";
import DocumentModal from "../components/DocumentModal";
import DocumentViewModal from "../components/DocumentViewModal";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { useAuth } from "../utils/Context";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [openNote, setOpenNote] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [UploadDoc, setUploadDoc] = useState(false);
    const [viewDoc, setViewDoc] = useState(null);
    const [notes, setNotes] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [baseUrl, setBaseUrl] = useState("");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBaseUrl = async () => {
            try {
                const result = await axios.get('http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/api/base-url', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` } 
                });
                setBaseUrl(result.data.baseUrl); 
            } catch (error) {
                console.error("Failed to fetch base URL:", error);
            }
        };

        fetchBaseUrl();
    }, []);

    // Toggle note modal
    const handleOpenNote = () => {
        setOpenNote(!openNote);
    };

    // Toggle document modal
    const handleOpenDoc = () => {
        setOpenDoc(!openDoc);
    };
   // Toggle document modal
   const handleUploadDoc = () => {
    setUploadDoc(!UploadDoc);
};

    // Open document view modal
    const handleViewDocument = async (filename) => {
        try {
            const result = await axios.get(`http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/view/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            setViewDoc({ filename, content: result.data.content });
        } catch (error) {
            console.error("Failed to fetch document:", error);
        }
    };

    // Fetch notes from backend
    const fetchNotes = async () => {
        try {
            const results = await axios.post(`http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/notes/fetch`, {
                email: user.email
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            setNotes(results.data);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    // Handle note deletion
    // Handle note deletion
    const deleteNote = async (note) => {
        try {
            // Generate nonce using Web Crypto API
            const generateNonce = () => {
                const array = new Uint8Array(16); // Create a 16-byte array
                window.crypto.getRandomValues(array); // Fill array with cryptographically secure random values
                return Array.from(array)
                    .map(byte => byte.toString(16).padStart(2, '0')) // Convert to hex and pad each byte
                    .join('');
            };
            const nonce = generateNonce();
            const timestamp = Date.now(); // Current time in milliseconds
            
            console.log('Nonce:', nonce);
            console.log('Timestamp:', timestamp);
    
            // Send API request with nonce and timestamp headers
            const response = await axios.post(
                `http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/notes/delete`,
                {
                    email: user.email,
                    title: note.title,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                        'X-Nonce': nonce,  // Nonce header
                        'X-Timestamp': timestamp,  // Timestamp header
                    },
                }
            );
    
            console.log('API Response:', response);
    
            fetchNotes();  // Call to refresh the notes after successful deletion
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };
    
    // Fetch documents from backend
    const fetchDocuments = async () => {
        try {
            const results = await axios.get(`http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/fetch`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            setDocuments(results.data);
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    // Handle document update
    const handleUpdateDocument = async (filename, content) => {
        try {
            await axios.put(`http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/update`, {
                filename,
                content
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            fetchDocuments();
            setViewDoc(null);
        } catch (error) {
            console.error("Failed to update document:", error);
        }
    };

    // Handle document deletion
    const handleDeleteDocument = async (filename) => {
        try {
            await axios.delete(`http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/documents/delete/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
            });
            fetchDocuments();
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };
    

    useEffect(() => {
        
        fetchNotes(); // Fetch notes when the component loads
        fetchDocuments(); // Fetch documents when the component loads
    
    }, [openNote, openDoc,UploadDoc, baseUrl]);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('Token'); 
        logout();
        navigate("/"); // Redirect to login page
    };
    const NavigatePhish = () => {
        navigate("/PhishPage"); // Redirect to Phishing page
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-slate-800 overflow-hidden">
            {openNote && <Modal handleOpen={handleOpenNote} />}
            {openDoc && <DocumentModal handleOpen={handleOpenDoc} />}
            {UploadDoc && <DocumentUploadModal handleOpen={handleUploadDoc} />}
            {viewDoc && (
                <DocumentViewModal
                    filename={viewDoc.filename}
                    content={viewDoc.content}
                    handleClose={() => setViewDoc(null)}
                    onUpdate={(filename, content) => handleUpdateDocument(filename, content)}
                    onDelete={(filename) => handleDeleteDocument(filename)}
                />
            )}
            <div className="h-14 bg-slate-900 flex items-center">
                <button className="text-white ml-auto mr-2 p-2 font-semibold" onClick={NavigatePhish}>Phishing Page</button>
                <button className="text-white ml-auto mr-2 p-2 font-semibold" onClick={handleLogout}>Logout</button>
            </div>
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
                {/* Notes Section */}
                <div className="w-full px-6 mt-2 flex flex-row">
                    <h1 className="text-2xl font-semibold text-white justify-start">Your notes</h1>
                    <button className="bg-blue-700 p-2 rounded-md text-white font-semibold ml-auto" onClick={handleOpenNote}>New Post</button>
                </div>
                <div className="mt-6 p-4 w-full bg-slate-700 rounded-md flex-1 gap-2 overflow-y-scroll hide-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map((note, index) => (
                            <div key={index} className="bg-slate-900 text-white rounded-md p-4 h-full">
                                <div className="flex flex-row">
                                    <h1 className="text-md font-semibold">{note.title}</h1>
                                    <button className="ml-auto" onClick={() => deleteNote(note)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                                            <path fill="#f04a3e" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: note.content }}></div>
                                
                            </div>
                        ))}
                    </div>
                </div>

                {/* Documents Section */}
                <div className="w-full px-6 mt-6 flex flex-row">
                    <h1 className="text-2xl font-semibold text-white justify-start">All documents</h1>
                    <button className="bg-blue-700 p-2 rounded-md text-white font-semibold ml-auto" onClick={handleOpenDoc}>Add Document</button>
                    <button className="bg-blue-700 p-2 rounded-md text-white font-semibold ml-auto" onClick={handleUploadDoc}>Upload Document</button>
                </div>
                <div className="mt-6 p-4 w-full bg-slate-700 rounded-md flex-1 gap-2 overflow-y-scroll hide-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((document, index) => (
                            <div key={index} className="bg-slate-900 text-white rounded-md p-4 h-full">
                                <div className="flex flex-row">
                                    <h1 className="text-md font-semibold">{document}</h1>
                                    <button className="bg-blue-500 text-white p-2 rounded ml-auto" onClick={() => handleViewDocument(document)}>
                                        Show
                                    </button>
                                    <button className="bg-red-500 text-white p-2 rounded ml-2" onClick={() => handleDeleteDocument(document)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
