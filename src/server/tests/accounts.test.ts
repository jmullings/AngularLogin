import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as mocha from 'mocha';
import * as mongoose from 'mongoose';
import * as MongoInMemory from 'mongo-in-memory';

import app from '../app/app';
import * as factory from './data.factory';
import {Accounts} from '../app/models/accounts';

// Allow chai to use external plugins
chai.use(chaiHttp);

/**
 * Test case for get account API
 */
function testGetAccount() {
    it('should not get Account details without a valid session', (done: MochaDone) => {
        chai.request(app)
        .get('/api/v1/account')
        .end((err: Error, res: Response) => {
            chai.expect(res.status).to.equal(401);
            chai.expect(res.body).to.be.an('object');
            chai.expect(res.body).to.have.property('code', 12);
            chai.expect(res.body).to.have.any.keys('message', 'internalMessage');
            done();
        });
    });
}

/**
 * Test case for post account API
 */
function testPostAccount() {
    it('should not create an Account with an empty request', (done: MochaDone) => {
        chai.request(app)
        .post('/api/v1/account')
        .end((err: Error, res: Response) => {
            chai.expect(res.status).to.equal(400);
            chai.expect(res.body).to.be.an('object');
            chai.expect(res.body).to.have.property('code', 10);
            chai.expect(res.body).to.have.any.keys('message', 'internalMessage');
            done();
        });
    });
    it('should not create an Account with invalid request data', (done: MochaDone) => {
        chai.request(app)
        .post('/api/v1/account')
        .send(factory.invalidAccount())
        .end((err: Error, res: Response) => {
            chai.expect(res.status).to.equal(400);
            chai.expect(res.body).to.be.an('object');
            chai.expect(res.body).to.have.property('code', 10);
            chai.expect(res.body).to.have.any.keys('message', 'internalMessage');
            done();
        });
    });
    it('should not create an Account with empty values in request', (done: MochaDone) => {
        chai.request(app)
        .post('/api/v1/account')
        .send(factory.emptyAccount())
        .end((err: Error, res: Response) => {
            chai.expect(res.status).to.equal(400);
            chai.expect(res.body).to.be.an('object');
            chai.expect(res.body).to.have.property('code', 10);
            chai.expect(res.body).to.have.any.keys('message', 'internalMessage');
            done();
        });
    });
    it('should not create an Account with an existing email', (done: MochaDone) => {
        // Create two random Accounts requests with the same email
        const accountA = factory.account();
        const accountB = factory.account({
            email: accountA.email,
        });
        // Inject first Account request into test database
        Accounts.create(accountA, (createErr: Error) => {
            // Send errors to callback
            if (createErr) {
                done(createErr);
            }
            chai.request(app)
            .post('/api/v1/account')
            .send(accountB)
            .end((err: Error, res: Response) => {
                chai.expect(res.status).to.equal(400);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('code', 11);
                chai.expect(res.body).to.have.any.keys('message', 'internalMessage');
                done();
            });
        });
    });
    it('should create an Account with a valid request', (done: MochaDone) => {
        chai.request(app)
        .post('/api/v1/account')
        .send(factory.account())
        .end((err: Error, res: Response) => {
            chai.expect(res.status).to.equal(200);
            chai.assert(res.body, '{}');
            done();
        });
    });
}

/**
 * RESTful API test suite for Accounts endpoint
 */
describe('REST API: Accounts', () => {
    // Create a new in memory MongoDB
    const mongoServerInstance = new MongoInMemory();

    before((done) => {
        // Start MongoDB server instance
        mongoServerInstance.start((mongoError: Error, config: object) => {
            // Connect to the test database
            const mongoURI = mongoServerInstance.getMongouri('test');
            mongoose.connect(mongoURI, (mongooseError: Error) => {
                done(mongoError || mongooseError);
            });
        });
    });

    afterEach((done) => {
        // Clear the test database
        mongoose.connection.db.dropDatabase((error: Error) => {
            done(error);
        });
    });

    after((done) => {
        // Stop MongoDB server instance and close the mongoose connection
        mongoServerInstance.stop(() => {
            mongoose.connection.close((error: Error) => {
                done(error);
            });
        });
    });

    describe('GET api/v1/account', testGetAccount);
    describe('POST api/v1/account', testPostAccount);
});
