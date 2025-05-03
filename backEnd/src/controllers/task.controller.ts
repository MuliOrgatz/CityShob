import { RequestHandler } from 'express';
import * as taskRepo from '../db/repositories/task.repository';
import { io } from '../server';

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 */
export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await taskRepo.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A task object
 *       404:
 *         description: Task not found
 */
export const getTask: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const todoID = req.params.id;
    const task = await taskRepo.getTaskById(todoID);
    if (!task) {
      throw new Error('Task not found');
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 */
export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const task = await taskRepo.createTask(req.body);
    io.emit('taskCreated', task);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
export const updateTask: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const task = await taskRepo.updateTask(req.params.id, req.body);
    if (!task) {
      throw new Error('Task not found');
    }
    io.emit('taskUpdated', task);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
export const deleteTask: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const task = await taskRepo.deleteTask(req.params.id);
    if (!task) {
      throw new Error('Task not found');
    }
    io.emit('taskDeleted', req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
