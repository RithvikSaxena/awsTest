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
            console.log(err)
        } else {
            res.send(results)
        }
    })
})

router.post('/fetch', (req, res) => {
    const email = req.body.email;
    db.query('SELECT * FROM notes WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.log(results)
            res.send(results)
        }
    })
})

export default router;