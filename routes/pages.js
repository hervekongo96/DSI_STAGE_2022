
const express = require('express');
const router = express.Router();


router.get('/www.scpt-dsi.cd', (req, res)=>{
    res.render('index')
})
router.get('/registrer', (req, res)=>{
    res.render('registrer')
}) 
router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/menu', (req, res)=>{
    res.render('menu')
})
router.get('/form', (req, res)=>{
    res.render('enregistrement')
})
router.get('/pre', (req, res)=>{
    res.render('presence')
})

module.exports = router;
 
