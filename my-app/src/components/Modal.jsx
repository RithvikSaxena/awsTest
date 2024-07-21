import React, {useState} from "react";
import axios from 'axios';
import { useAuth } from "../utils/Context";

const Modal = ({handleOpen}) => {
    const {user, login, logout} = useAuth();
    console.log(user)

    const handleSubmit = async () => {
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        try{
            const result = await axios.post("http://localhost:5000/notes/create", {
                email: user.email,
                title: title,
                content: content
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(result)
            handleOpen();
        } catch(err) {
            console.error(err)
        }
    };

    const handleClose = () => {
        handleOpen();
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="w-1/2 bg-slate-800 p-6 rounded shadow-md">
                <h2 className="text-white text-xl font-bold mb-4">Create Note</h2>
                <form>
                    <div className="mb-4 mt-4">
                        <label className="block text-white">Title</label>
                        <input id="title" type="text" name="details" className="w-full p-2 border bg-slate-900 border-gray-600 rounded mt-1 text-white" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white">Content</label>
                        <input id="content" type="text" name="details" className="w-full p-2 border bg-slate-900 border-gray-600 rounded mt-1 text-white" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="bg-slate-500 text-white px-4 py-2 rounded mr-2" onClick={handleClose}>Cancel</button>
                        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal