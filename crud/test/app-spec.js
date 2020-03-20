const request = require('supertest');
const {
    app
    } = require('../src/app');

describe("app", () => {
    it("should get all accounts when request url pattern is '/accounts'", (done) => {
        request(app).get('/accounts').expect(200).expect(
            [
                {
                    "name": "Zhang San",
                    "email": "2@qq.com"
                }
            ]
        ).end((err,res) => {
            if(err) throw err
            done()
        })
    })
})
