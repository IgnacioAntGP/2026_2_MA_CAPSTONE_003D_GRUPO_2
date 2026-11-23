const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;