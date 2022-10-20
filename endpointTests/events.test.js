const request = require('supertest');
const app = require('../app')


describe('GET /events', () => {
    it('should get all events', async () => {
        const response = await request('https://127')
            .get('/events');
            await expect(response.statusCode).toBe(200) // If redirected to 308, test fails
            await expect([200, 308]).toContain(response.statusCode) // Allows for 200 or 308, but because everything redirects, this is no good
        })

    it('Should get one event from 12/12/26', async () => {
        const response = await request(app)
            .get('/events')
            .send({ startDate: '2022-12-26' })

            await expect(response.statusCode).toBe(200) // If redirected to 308, test fails
            // await expect([200, 308]).toContain(response.statusCode) // Allows for 200 or 308 response
    })
})

describe('USERS', () => {
    it('should sign in Jest test user', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({username: "admin", password: "password"})
            await expect([200, 308]).toContain(response.statusCode)
    })
})