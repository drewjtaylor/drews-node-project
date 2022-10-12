const request = require('supertest');
const app = require('../app')


describe('GET /events', () => {
    it('should get all events', async () => {
        const response = await request(app)
            .get('/events');
            await expect(response.statusCode).toBe(200)
        })

        it('Should get one event from 12/12/26', async () => {
            const response = await request(app)
            .get('/events')
            .send({ startDate: '2022-12-26' })
            
            await expect(response.statusCode).toBe(200) // if it redirects and gives 308, it will error out
        console.log(`The response is:\n${JSON.stringify(response, null, 2)}`)
    })
})