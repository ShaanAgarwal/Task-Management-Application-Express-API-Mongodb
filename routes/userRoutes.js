const express = require('express');
const { registerUser, loginUser, getAllUsers, getSingleUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getAllUsers', getAllUsers);
router.get('/getUser/:userId', getSingleUserById);

module.exports = router;