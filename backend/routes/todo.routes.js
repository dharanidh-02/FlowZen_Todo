const express = require('express');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todo.controller.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').get(protect, getTodos).post(protect, createTodo);
router.route('/:id').put(protect, updateTodo).delete(protect, deleteTodo);

module.exports = router;
