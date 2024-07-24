const express = require('express');
const { createTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/createTask/:userId', createTask);

module.exports = router;