import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.route';

import db from '../tests/db';

// Setup connection to the database
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

const app = new express();
// Pass supertest agent for each test
const agent = request.agent(app);
app.use('/api/auth', authRoutes);

describe('Auth Routes', function () {

  it('responds with json', function (done) {
    request(app)
      .post('/api/auth/signup')
      .send({ username: 'john', email: "test@test.com", password: "test1234" })
      .set('Accept', 'application/json')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  }, 60000);
});