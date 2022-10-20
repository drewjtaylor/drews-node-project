const {MongoClient} = require('mongodb');
const {mongoUrl, secretKey, mongoDbName} = require('../config')


describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(mongoUrl, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db = await connection.db(mongoDbName)
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should insert new user document into collection', async () => {
        const users = db.collection('users');

        // Clear previous entry if it failed to delete before
        await users.deleteOne({_id: 'some-user-id'});
        
        const mockUser = {
            _id: 'some-user-id',
            email: 'jest-test-email@something.com',
            firstName: 'FirstJestName',
            lastName: 'LastJestName'
        }
        
        
        
        await users.insertOne(mockUser);
        const insertedUser = await users.findOne({_id: 'some-user-id'});
        expect(insertedUser).toEqual(mockUser);
        
        await users.deleteOne({_id: 'some-user-id'});
    })





})