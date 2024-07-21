import express from 'express';
import db from '../../config/mysql.js'

const router = express.Router();
router.use(express.json());

router.post('/create', (req,res) => {
    const email = req.body.email;
    const title = req.body.title;
    const content = req.body.content;
    //insert into notes table
    db.query('INSERT INTO notes (email, title, content) values (?,?,?)', [email, title, content], (err, results) => {
        if (err) {
            res.status(500).json({error: err})
        } else {
            res.status(200).send(results);
        }
    })
})

router.post('/fetch', (req, res) => {
    const email = req.body.email;
    console.log(email)
    db.query('SELECT * FROM notes WHERE email = ?', [email], (err, results) => {
        if (err) {
            res.status(500).json({error: err})
        } else {
            console.log(results)
            res.status(200).send(results);
        }
    })
})

router.post('/delete', (req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    db.query('DELETE FROM notes WHERE email = ? and title = ?', [email, title], (err, results) => {
        if(err){
            res.status(500).json({error: err})
        } else {
            res.status(200).send(results);
        }
    })
})

export default router;