import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();

const tasks = []

app.route('/tasks')
  .get((_, res) => {
    return res.json(tasks)
  })
  .post((req, res) => {
    if(!req.body?.title) res.status(400).send('Task title is required')
    if(!req.body?.description) res.status(400).send('Task description is required')
    const { title, description } = req.body;

    const newTask = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    tasks.push(newTask)

    return res.status(201).json(newTask)
  });

app.route('/tasks/:id')
  .put((req, res) => {
    const { id } = req.params;

    if(!req.body?.title) return res.status(400).send('Task title is required')
    if(!req.body?.description) return res.status(400).send('Task description is required')

    const { title, description } = req.body;

    const index = tasks.findIndex(t => t.id === id)
    
    if(index < 0) return res.status(404).send('Task not found')

    const newTask = {
      ...tasks[index],
      title,
      description,
      updated_at: new Date(),
    }

    tasks[index] = newTask;

    return res.json(newTask)
  })
  .delete((req, res) => {
    const { id } = req.params;

    const index = tasks.findIndex(t => t.id === id)
    
    if(index < 0) return res.status(404).send('Task not found')

    tasks.splice(index, 1)

    return res.status(204).send()
  });

app.patch('/tasks/:id/complete', (req, res) => {
  const { id } = req.params;

  const index = tasks.findIndex(t => t.id === id)
  
  if(index < 0) return res.status(404).send('Task not found')

  const newTask = {
    ...tasks[index],
    completed_at: new Date(),
  }

  tasks[index] = newTask;

  return res.json(newTask)
});

app.listen(3333)