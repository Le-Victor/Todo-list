const request = require('supertest')
const {
    app
    } = require('../src/app')
const {
    asyncReadFile,
    asyncWriteFile
} = require('../src/dao')

describe("app", () => {
    describe("get request", () =>{
        it("should get all tasks when request url pattern is '/api/tasks'", (done) => {
            request(app).get('/api/tasks').expect(200).expect(
                [
                    {
                        "id": 1, 
                        "content": "Restful API homework",  
                        "createdTime": "2019-05-15T00:00:00Z"
                    },
                    {
                        "id": 2,
                        "content": "Todo list homework",
                        "createdTime": "2020-05-15T00:00:00Z"
                    }
                ]
            ).end((err,res) => {
                if(err) throw err
                done()
            })
        })
        it("should get the unique task when request url pattern is '/api/tasks/:id'", (done) => {
            request(app).get('/api/tasks/1').expect(200).expect(
                    {
                        "id": 1, 
                        "content": "Restful API homework",  
                        "createdTime": "2019-05-15T00:00:00Z"
                    }
            ).end((err,res) => {
                if(err) throw err
                done()
            })
        })
    })

    describe("post request", () =>{
        it("should create a new task when request url pattern is '/api/tasks'", (done) => {
            request(app).post('/api/tasks').send({
                    "id": 3,
                    "content": "Git homework",
                    "createdTime": "2020-03-11T00:00:00Z"
            }).expect(201).expect(
                [
                    {
                        "id": 1, 
                        "content": "Restful API homework",  
                        "createdTime": "2019-05-15T00:00:00Z"
                    },
                    {
                        "id": 2,
                        "content": "Todo list homework",
                        "createdTime": "2020-05-15T00:00:00Z"
                    },
                    {
                        "id": 3,
                        "content": "Git homework",
                        "createdTime": "2020-03-11T00:00:00Z"
                    }
                ]
            ).end((err,res) => {
                if(err) throw err
                done()
            })
        })
        it("should not create the task when its id has already existed", (done) => {
            request(app).post('/api/tasks').send({
                "id": 1, 
                "content": "Todo list homework",  
                "createdTime": "2020-05-15T00:00:00Z"
            }).expect(400).end((err, res) => {
              if (err) throw err
              done()
            })
        })
    })

    describe("put request", () =>{
        it("should update the task with the same id", (done) => {
            request(app).put('api/tasks').send({
                "id": 2,
                "content": "Git web homework",
                "createdTime": "2020-03-21T00:03:29Z"
            }).expect(202).expect(
                [
                    {
                        "id": 1, 
                        "content": "Restful API homework",  
                        "createdTime": "2019-05-15T00:00:00Z"
                    },
                    {
                        "id": 2,
                        "content": "Git web homework",
                        "createdTime": "2020-03-21T00:03:29Z"
                    },
                    {
                        "id": 3,
                        "content": "Git homework",
                        "createdTime": "2020-03-11T00:00:00Z"
                    }
                ]
            ).end((err,res) => {
                if(err) throw err
                done()
            })
        })
    })

    describe("delete request", () =>{
        it("should delete the task with the same id", (done) => {
            request(app).delete('api/tasks/1').expect(203).expect(
                [
                    {
                        "id": 2,
                        "content": "Git web homework",
                        "createdTime": "2020-03-21T00:03:29Z"
                    },
                    {
                        "id": 3,
                        "content": "Git homework",
                        "createdTime": "2020-03-11T00:00:00Z"
                    }
                ]
            ).end((err,res) => {
                if(err) throw err
                done()
            })
        })
        it("should not delete the task when its id is already existed", (done) => {
            request(app).post('/api/tasks/100').expect(404).end((err, res) => {
              if (err) throw err
              done()
            })
        })
    })

})
