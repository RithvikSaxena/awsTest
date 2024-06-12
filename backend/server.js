import express from 'express';
import cors from 'cors';
import userauth from './routes/auth/userauth.js';
import notes from './routes/notes/notes.js'; 

const app = express();
app.use(cors())
app.use('/auth', userauth);
app.use('/notes', notes);

app.get(('/'), (req, res)=>{
    res.send("API is running and avaliable")
})

app.listen(5000, () => {
    console.log(`Server is running on port ${5000}`);
});