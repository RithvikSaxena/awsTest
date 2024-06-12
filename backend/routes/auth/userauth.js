import express from 'express';
import db from '../../config/mysql.js'

const router = express.Router();
router.use(express.json());

router.post('/login',(req,res)=>{
    console.log(req.body)
    const {email, password} = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                res.send(result)
            }else{
                res.send(result)
                console.log("Wrong password or username")
            }
        }
    })
})

router.post('/signup',(req,res)=>{
    const {email, password} = req.body
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0){
                console.log("User already exists")
            }else{
                //insert user into database
                db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.send("Values inserted")
                    }
                })
            }
        }
    }
    )
})

export default router;