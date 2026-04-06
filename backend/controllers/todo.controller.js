const Todo = require('../models/Todo.model.js');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userid }).sort({ createdAt: 1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, description, due_date, priority, tags, subtasks, is_habit } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    const todo = await Todo.create({
      user: req.user.userid,
      title,
      description: description || '',
      due_date: due_date || null,
      priority: priority || 'medium',
      tags: tags || [],
      subtasks: subtasks || [],
      is_habit: is_habit || false
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, description, due_date, completed, priority, tags, subtasks, is_habit } = req.body;
    let todo = await Todo.findById(req.params.id);
    
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    // Verify user owns the todo
    if (todo.user.toString() !== req.user.userid.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo.title = title !== undefined ? title : todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.due_date = due_date !== undefined ? due_date : todo.due_date;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.priority = priority !== undefined ? priority : todo.priority;
    todo.tags = tags !== undefined ? tags : todo.tags;
    todo.subtasks = subtasks !== undefined ? subtasks : todo.subtasks;
    todo.is_habit = is_habit !== undefined ? is_habit : todo.is_habit;

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (todo.user.toString() !== req.user.userid.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await todo.deleteOne();
    res.status(200).json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
