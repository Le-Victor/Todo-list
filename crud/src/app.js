const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const {
    asyncReadFile,
    asyncWriteFile
} = require("./dao.js");
app.use(express.json())


app.get('/accounts', (req, res) => fs.readFile('./data.json', 'utf-8', (err, data) => {
    if (err) {
        res.status(500).send()
    } else {
        res.send(JSON.parse(data))
    }
}))

// const asyncReadFile = function(path) {
//     return new Promise(
//         function(resolve, reject) {
//             fs.readFile(path, 'utf-8', function(err, data) {
//                 if(err) {
//                     reject(err)
//                 }
//                 resolve(data)
//             })
//         }).catch(err => {
//         return err
//     })
// }

// const asyncWriteFile = function(string, path) {
//     return new Promise(function (resolve, reject){
//         fs.writeFile(path, string, function(err){
//             reject(err)
//         })
//     }).catch(err => {
//         return err
//     })
// }

const createAccount = async (req, res) => {
    const newAccount = req.body
    const file = await asyncReadFile('./data.json')
    const accounts = JSON.parse(file)
    if (accounts.filter(v => v.email === newAccount.email).length != 0) {
        res.status(400).send()
    } else {
        accounts.push(newAccount)
        await asyncWriteFile(JSON.stringify(accounts), './data.json')
        res.status(201).send(accounts)
    }
}

// exports.createTask = async(req, res) => {
//     const newTask = req.body;
//     const file = await asyncReadFile(req.app.locals.dataFilePath);
//     const taskList = JSON.parse(file);
//     if(taskList.filter(v => v.id === newTask.id).length != 0){
//         res.status(400).send();
//     }else{
//         taskList.push(newTask);
//         await asyncWriteFile(JSON.stringify(taskList), req.app.locals.dataFilePath);
//         res.status(201).send(taskList);
//     }
// }
app.post('/accounts', createAccount)

app.listen(port, () => console.log(`Our server has been setup and listen on the port: ${port}!`))
exports.app = app