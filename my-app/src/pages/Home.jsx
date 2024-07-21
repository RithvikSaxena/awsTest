import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/Context";
import axios from "axios";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const Home = () =>{
    const [open, setOpen] = useState(false);
    const {user, login, logout} = useAuth();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    const handleOpen = () =>{
        setOpen(!open);
    }  

    const fetchNotes = async () => {
        try{
            console.log(user.email)
            const results = await axios.post("http://localhost:5000/notes/fetch", {
                    email: user.email
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setNotes(results.data);
        } catch(error){
            console.error(error);
        }
    }

    const deleteNote = async (note) => {
        try{
            const response = await axios.post('http://localhost:5000/notes/delete', {
                email: user.email,
                title: note.title
            })
            fetchNotes();
        } catch(error){
            console.error(error);
        }
    }
    
    useEffect(()=>{
        fetchNotes();
    }, [open])

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return(
        <div className="w-screen h-screen flex flex-col bg-slate-800 overflow-hidden">
            {open &&
            <Modal handleOpen={handleOpen}/>}
            <div className="h-14 bg-slate-900 flex items-center">
                <button className="text-white ml-auto mr-2 p-2 font-semibold" onClick={handleLogout}>Logout</button>
            </div>
            <div className="flex-1 p-4 flex flex-col overflow-hidden">
                <div className="w-full px-6 mt-2 flex flex-row">
                    <h1 className="text-2xl font-semibold text-white justify-start">Your notes</h1>
                    <button className="bg-blue-700 p-2 rounded-md text-white font-semibold ml-auto" onClick={handleOpen}>New Post</button>
                </div>
                <div className="mt-6 p-4 w-full bg-slate-700 rounded-md flex-1 gap-2 overflow-y-scroll hide-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.map((note, index) => (
                            <div key={index} className="bg-slate-900 text-white rounded-md p-4 h-48">
                                <div className="flex flex-row">
                                    <h1 className="text-md font-semibold">{note.title}</h1>
                                    <button className="ml-auto" onClick={()=>deleteNote(note)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#f04a3e" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"/></svg>
                                    </button>
                                </div>
                                <p className="mt-2">{note.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home