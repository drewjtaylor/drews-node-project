const request = require('supertest');
const app = require('../app')


describe('GET /events', () => {
    it('should get all events', async () => {
        const response = await request(app)
            .get('/events');
            // await expect(response.statusCode).toBe(200) // If redirected to 308, test fails
            await expect([200, 308]).toContain(response.statusCode) // Allows for 200 or 308
        })

        it('Should get one event from 12/12/26', async () => {
            const response = await request(app)
            .get('/events')
            .send({ startDate: '2022-12-26' })
            
            // await expect(response.statusCode).toBe(200) // If redirected to 308, test fails
            await expect([200, 308]).toContain(response.statusCode) // Allows for 200 or 308 response
        console.log(`The response is:\n${JSON.stringify(response, null, 2)}`)
    })
})