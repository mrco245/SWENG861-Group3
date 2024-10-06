import express from 'express';
import request from 'supertest';
import { afterAll, describe, expect, test } from 'vitest';
import userRoutes from '../routes/user.route';
import authRoutes from '../routes/auth.route';
import cookieParser from "cookie-parser";
import * as db from './db';

const app = new express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

describe('User Routes', () => {
  // Setup connection to the database
  beforeAll(async () => await db.connect());
  afterAll(async () => await db.closeDatabase());

  // Test for searching users
  test('GET /api/user/search/:username should return matching users', async () => {
    const testUser = { username: 'testUser', email: 'user@test.com', password: 'user' };
    await request(app).post('/api/auth/signup').send(testUser);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const searchResult = await request(app)
      .get(`/api/user/search/${encodeURIComponent(testUser.username)}`)
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    expect(searchResult.statusCode).toBe(200);
    expect(searchResult.body[0].username).toBe(testUser.username);
  });

  // Test for sending a friend request
  test('POST /api/user/add-friend should send a friend request', async () => {
    const testUser = { username: 'testUser', email: 'user@test.com', password: 'user' };
    const friendUser = { username: 'friendUser', email: 'friend@test.com', password: 'friend' };
    
    await request(app).post('/api/auth/signup').send(testUser);
    await request(app).post('/api/auth/signup').send(friendUser);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const response = await request(app)
      .post('/api/user/add-friend')
      .send({ friendUsername: friendUser.username })
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('Friend request sent successfully.');
  });

  // Test for accepting a friend request
  test('POST /api/user/accept-request should accept a friend request', async () => {
    const testUser = { username: 'testUser', email: 'user@test.com', password: 'user' };
    const friendUser = { username: 'friendUser', email: 'friend@test.com', password: 'friend' };
    
    await request(app).post('/api/auth/signup').send(testUser);
    await request(app).post('/api/auth/signup').send(friendUser);

    const loginFriend = await request(app).post('/api/auth/signin').send(friendUser);
    await request(app)
      .post('/api/user/add-friend')
      .send({ friendUsername: testUser.username })
      .set('Cookie', loginFriend.headers['set-cookie'][0]);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const acceptResponse = await request(app)
      .post('/api/user/accept-request')
      .send({ friendUsername: friendUser.username })
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    expect(acceptResponse.statusCode).toBe(200);
    expect(acceptResponse.body).toBe('Friend request accepted.');
  });

  // Test for declining a friend request
  test('POST /api/user/decline-request should decline a friend request', async () => {
    const testUser = { username: 'testUser', email: 'user@test.com', password: 'user' };
    const friendUser = { username: 'friendUser', email: 'friend@test.com', password: 'friend' };
    
    await request(app).post('/api/auth/signup').send(testUser);
    await request(app).post('/api/auth/signup').send(friendUser);

    const loginFriend = await request(app).post('/api/auth/signin').send(friendUser);
    await request(app)
      .post('/api/user/add-friend')
      .send({ friendUsername: testUser.username })
      .set('Cookie', loginFriend.headers['set-cookie'][0]);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const declineResponse = await request(app)
      .post('/api/user/decline-request')
      .send({ friendUsername: friendUser.username })
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    expect(declineResponse.statusCode).toBe(200);
    expect(declineResponse.body).toBe('Friend request declined.');
  });

  // Test for removing a friend
  test('POST /api/user/remove-friend should remove a friend', async () => {
    const testUser = { username: 'testUser', email: 'user@test.com', password: 'user' };
    const friendUser = { username: 'friendUser', email: 'friend@test.com', password: 'friend' };
    
    await request(app).post('/api/auth/signup').send(testUser);
    await request(app).post('/api/auth/signup').send(friendUser);

    const loginFriend = await request(app).post('/api/auth/signin').send(friendUser);
    await request(app)
      .post('/api/user/add-friend')
      .send({ friendUsername: testUser.username })
      .set('Cookie', loginFriend.headers['set-cookie'][0]);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    await request(app)
      .post('/api/user/accept-request')
      .send({ friendUsername: friendUser.username })
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    const removeResponse = await request(app)
      .post('/api/user/remove-friend')
      .send({ friendUsername: friendUser.username })
      .set('Cookie', loginUser.headers['set-cookie'][0]);

    expect(removeResponse.statusCode).toBe(200);
    expect(removeResponse.body).toBe('Friend request declined.');
  });

});