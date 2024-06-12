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
        console.log(user.email)
        const results = await axios.post("http://localhost:3000/notes/fetch", {
                email: user.email
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        setNotes(results.data);
    }
    
    useEffect(()=>{
        fetchNotes();
    }, [open])

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return(
        <div className="w-screen h-screen bg-slate-800">
            {open &&
            <Modal handleOpen={handleOpen}/>}
            <div className="h-14 bg-slate-900 flex items-center">
                <button className="text-white ml-auto mr-2 p-2 font-semibold" onClick={handleLogout}>Logout</button>
            </div>
            <div className="flex-1 p-4">
                <div className="w-full px-6 mt-2 flex flex-row">
                    <h1 className="text-2xl font-semibold text-white justify-start">Your notes</h1>
                    <button className="bg-blue-700 p-2 rounded-md text-white font-semibold ml-auto" onClick={handleOpen}>New Post</button>
                </div>
                <div className="mt-6 p-4 w-full h-96 bg-slate-700 rounded-md grid grid-cols-3 gap-2">
                    {notes.map((note, index)=>{
                        return(
                            <div key={index} className="w-full h-full bg-slate-900 text-white rounded-md p-2">
                                <h1 className="text-md font-semibold">{note.title}</h1>
                                <p className="mt-2">{note.content}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home