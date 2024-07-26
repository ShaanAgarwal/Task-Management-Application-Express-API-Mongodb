const express = require('express');
const { createTask, getAllTasksForUser, updateTaskForUser } = require('../controllers/taskController');
const router = express.Router();

router.post('/createTask/:userId', createTask);
router.get('/getAllTasksForUser/:userId', getAllTasksForUser);
router.put('/updateTaskForUser/:userId/:taskId', updateTaskForUser);

module.exports = router;