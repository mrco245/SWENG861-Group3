import express from 'express';
import request from 'supertest';
import { afterAll, afterEach, describe, expect, test } from 'vitest';
import userRoutes from '../routes/user.route';
import authRoutes from '../routes/auth.route';
import cookieParser from "cookie-parser";
import * as db from './db';
import jwt from "jsonwebtoken";
import { config } from '../config/config.js'

const app = new express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

describe('User Routes', () => {
  // Setup connection to the database
  beforeAll(async () => await db.connect());
  afterAll(async () => await db.closeDatabase());

  test('POST /api/user/update should return updated user', async () => {
    const testUser = { username: "testUser", email: "user@test.com", password: "user" };
    const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    expect(registerUser.statusCode).toBe(201);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const updatedTestUser = { username: "testUser", email: "user@test.com", password: "user2" };

    const updateUser = await request(app).put('/api/user/update/' + loginUser.body._id).send(updatedTestUser).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(updateUser.statusCode).toBe(200);
  });

  test('POST /api/user/update should return 401, You can update only your account', async () => {
    const testUser = { username: "testUser2", email: "user2@test.com", password: "user2" };
    const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    expect(registerUser.statusCode).toBe(201);

    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const updatedTestUser = { username: "testUser2", email: "user2@test.com", password: "user22" };

    const updateUser = await request(app).put('/api/user/update/' + loginUser.body._id + 1).send(updatedTestUser).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(updateUser.statusCode).toBe(401);
    expect(updateUser.text).toContain('You can update only your account!')
  });

  test('POST /api/user/update should return 401, You are not authinticated !', async () => {
    const testUser = { username: "testUser2", email: "user2@test.com", password: "user2" };
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const updatedTestUser = { username: "testUser2", email: "user2@test.com", password: "user22" };
    const updateUser = await request(app).put('/api/user/update/' + loginUser.body._id).send(updatedTestUser);
    expect(updateUser.statusCode).toBe(401);
    expect(updateUser.text).toContain('You are not authinticated !')
  });

  test('POST /api/user/delete should return deleted user', async () => {
    const testUser = { username: "testUser3", email: "user3@test.com", password: "user3" };
    const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const updateUser = await request(app).delete('/api/user/delete/' + loginUser.body._id).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(updateUser.statusCode).toBe(200);
  });

  test('POST /api/user/delete should return 401, You can only delete your account', async () => {
    const testUser = { username: "testUser3", email: "user3@test.com", password: "user3" };
    const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    const updateUser = await request(app).delete('/api/user/delete/' + loginUser.body._id+1).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(updateUser.statusCode).toBe(401);
  });

});