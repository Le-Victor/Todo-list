const express = require('express')
const fs = require('fs')
const app = express()
const port = 4000
const {
    asyncReadFile,
    asyncWriteFile
} = require("./dao.js")
app.use(express.json())

const GetAllTasks = (req, res) => fs.readFile('./data.json', "utf-8", (err, data) => {
    if(err) {
        return res.status(500).send()
    }
    res.send(JSON.parse(data))
})

const GetTask = async(req, res) => {
    const number = req.params.id
    const file = await asyncReadFile('./data.json')
    const tasks = JSON.parse(file).filter(v => v.id == number)
    tasks.length == 0 ? res.status(404).send() : res.send(tasks[0])
}

const CreateTask = async (req, res) => {
    const newTasks = req.body
    const file = await asyncReadFile('./data.json')
    const tasks = JSON.parse(file)
    if (tasks.filter(v => v.id === newTasks.id).length != 0) {
        res.status(400).send()
    } else {
        tasks.push(newTasks)
        await asyncWriteFile(JSON.stringify(tasks), './data.json')
        res.status(201).send(tasks)
    }
}

const UpdateTask = async (req, res) => {
    const put = req.body
    const file = await asyncReadFile('./data.json')
    const tasks = JSON.parse(file)
    const change = tasks.filter(v => v.id == put.id)
    // res.send(change)
    if(change.length == 0){
        this.createAccount(req.res)
    }else {
        tasks.forEach((value, index, array) => {
            if (value.id === put.id) {
                array[index] = {
                    ...value,
                    ...put
                }
            }
        })
        await asyncWriteFile(JSON.stringify(tasks), './data.json')
        res.status(202).send(tasks)
    }
}

const deleteTask = async (req, res) => {
    const number = req.params.id
    const file = await asyncReadFile('./data.json')
    const tasks = JSON.parse(file)
    const newTasks = tasks.filter(v => v.id != number)
    if (newTasks.length === tasks.length) {
        res.status(404).send()
    } else{
        await asyncWriteFile(JSON.stringify(newTasks), './data.json')
        res.status(203).send(newTasks)
    }
}

app.get("/api/tasks", GetAllTasks)

app.get("/api/tasks/:id", GetTask)

app.post('/api/tasks', CreateTask)

app.put("/api/tasks", UpdateTask)

app.delete("/api/tasks/:id",deleteTask);

app.listen(port, () => console.log(`Our server has been setup and listen on the port: ${port}!`))
exports.app = app