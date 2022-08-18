const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

let usersDB = []

const PORT = 3333

const app = express()

app.use(cors())
app.use(express.json())

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const userFinded = usersDB.find((user) => user.username === username)
  if (!userFinded) {
    return response.status(404).json({ message: 'Username not found' })
  }
  request.user = userFinded
  next()
}

app.get('/', (request, response) => {
  return response.json({ message: 'hello world' })
})
app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExists = usersDB.find((user) => user.username === username)
  if (userAlreadyExists) {
    return response.status(403).json({ message: 'Username already exists' })
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  usersDB.push(newUser)

  return response.status(201).json(newUser)
})

app.use(checkExistsUserAccount)

app.get('/todos/', (request, response) => {
  const { user } = request

  return response.json(user.todos)
})

app.post('/todos/', (request, response) => {
  const { user } = request
  const { title, deadline } = request.body


  const newTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTask)


  return response.status(201).json(newTask)
})

app.put('/todos/:id', (request, response) => {
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  const taskFinded = user.todos.find((task) => task.id === id)
  if (!taskFinded) {
    return response.status(404).json({ message: 'Task not found' })
  }

  const { created_at, done } = taskFinded

  const updatedTask = {
    id,
    title: title ? title : taskFinded.title,
    done,
    deadline: deadline ? new Date(deadline) : taskFinded.deadline,
    created_at
  }

  user.todos = user.todos.map(task => {
    if (task.id === id) {
      return updatedTask
    } else {
      return task
    }
  })

  return response.json(updatedTask)
})

app.delete('/todos/:id', (request, response) => {
  const { user } = request
  const { id } = request.params

  let taskFindedIndex = user.todos.findIndex((task) => task.id === id);
  if (taskFindedIndex >= 0) {
    user.todos.shift(taskFindedIndex, 1);
    return response.status(200).json({ ok: true });
  } else {
    return response.status(404).json({ message: 'Task not found' })
  }

})

app.patch('/todos/:id/done', (request, response) => {
  const { user } = request
  const { id } = request.params


  const taskFinded = user.todos.find((task) => task.id === id)
  if (!taskFinded) {
    return response.status(404).json({ message: 'Task not found' })
  }

  const { title, deadline, created_at, } = taskFinded

  const updatedTask = {
    id,
    title,
    done: true,
    deadline,
    created_at
  }

  user.todos = user.todos.map(task => {
    if (task.id === id) {
      return updatedTask
    } else {
      return task
    }
  })

  return response.json(updatedTask)
})




console.log(`Running on ${PORT}`)
app.listen(PORT)
