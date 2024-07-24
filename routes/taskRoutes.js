const express = require('express');
const { createTask, getAllTasksForUser } = require('../controllers/taskController');
const router = express.Router();

router.post('/createTask/:userId', createTask);
router.get('/getAllTasksForUser/:userId', getAllTasksForUser);

module.exports = router;