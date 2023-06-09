const express = require('express');
const authController = require('../controllers/auth');


const router = express.Router();

router.post('/registrer', authController.registrer)
router.post('/login', authController.login)
router.post('/soumettre', authController.soumettre);
router.post('/presence', authController.presence);
router.post('auth/soumettre', authController.soumettre);
router.post('auth/presence', authController.presence);

 
module.exports = router;
