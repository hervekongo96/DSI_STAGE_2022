const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    key: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

//se connecter

exports.login = async (req, res) =>{ 

    try {
        const user = { pseudo, password } = req.body;
        console.log(user);

        if(!pseudo || !password){
            return res.status(400).render('login', {
                message: 'remplir les deux champs SVP!'
            })
        }
        db.query('SELECT * FROM users WHERE pseudo = ?', [ pseudo ], async(error, results)=>{
            
            console.log(results)
            
            if(error){
                res.status(401).render('login',{
                    message: 'Aucun compte' 
                })
            }
            if(!results.length){
                res.status(401).render('login',{
                    message: 'Aucun stagiaire trouvé' 
                })
            }
           
            if(password !== results[0].password){
                res.status(401).render('login',{
                    message: 'Pseudo ou mot de Passe incorect' 
                }) 
            }
            else{
                const id = results[0].id;
                const token =jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("le token est :" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.redirect('/menu')
            } 
        })

        }catch (error)  
        
        {
            console.log(error);
        }
     
}

//envoi

exports.registrer = (req, res)=>{
    console.log(req.body); 

    const {nom, prenom, pseudo, password, passwordconfirm} = req.body;

    db.query('SELECT pseudo FROM users WHERE pseudo = ?', [pseudo], async (error, results)=>{
        if(error){
            console.log(error)
        }
        if(results.length > 0){
            return res.render('registrer', {
                message : 'ce compte existe'
            })
        }else if(password !== passwordconfirm){
            return res.render('registrer', {
                message : 'mot de passe incorrect'
            })
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
    db.query('INSERT INTO users SET ?', {nom: nom, prenom: prenom, pseudo: pseudo, password: password}, (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
            return res.render('message',{
                message: 'vous avez un compte avec succès'
            })
        }
    })
    })

}

exports.soumettre = (req, res)=>{
    console.log(req.body); 

    const {nom, postnom, prenom, sexe, universite, faculte, departement, telephone, debut, fin, encadreur} = req.body;

    db.query('SELECT telephone FROM stagiaire WHERE telephone = ?', [telephone], async (error, results)=>{
        if(error){
            console.log(error)
        }
        if(results.length > 0){
            return res.render('message', {
                message : 'ce compte existe'
            })
        }
    db.query('INSERT INTO stagiaire SET ?', {nom:nom, postnom:postnom, prenom:prenom, sexe:sexe, universite:universite, faculte:faculte, departement:departement, telephone:telephone, debut:debut, fin:fin, encadreur:encadreur}, (error, results)=>{
        if(error){
            console.log(error)
        }else{
            console.log(results)
            return res.render('message',{
                message: 'vous etes enregistrer'
            })
        }
    })
    })

}
exports.presence = (req, res)=>{
    
    console.log(req.body); 

    var now = new Date();
    const date  = now.toLocaleDateString();
    const heure = now.toLocaleTimeString();
    const {nom, postnom, prenom} = req.body;

    //SELECT nom, date FROM presence WHERE nom=? and date=?

    db.query(`SELECT nom, date FROM presence WHERE nom=? ORDER BY id DESC LIMIT 1`, [nom], async (error, results)=>{
        console.log(results);
        //console.log(results.length);
        console.log(results[0].date)
        console.log(date)
        console.log(nom)
        if(error){
            console.log(error)
        }
        if(results[0].date == date){
            return res.render('presence', {
                message : 'vous êtes déjà présent(e)'
            })
        }else{
            db.query('INSERT INTO presence SET ?', {nom:nom, postnom:postnom, prenom:prenom, date:date, heure:heure}, (error, results)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log(results)
                    return res.render('message',{
                        message: 'vous êtes présent(e)'
                    })
                }
            })
        }
    })

}

