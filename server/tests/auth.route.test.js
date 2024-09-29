import express from 'express';
import request from 'supertest';
import { afterAll, afterEach, describe, expect, test } from 'vitest';
import authRoutes from '../routes/auth.route';
import * as db from './db';

const app = new express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  // Setup connection to the database
  beforeAll(async () => await db.connect());
  afterAll(async () => await db.closeDatabase());

  test('POST /api/auth/signup should return user created', async () => {
    const testUser = { username: "test", email: "test@text.com", password: "test1234" };
    const signup = await request(app).post('/api/auth/signup').send(testUser);
    expect(signup.statusCode).toBe(201)
    expect(signup.body.message).toBe('User created successfully !');
  });

  test('POST /api/auth/signup should return email already exists', async () => {
    const testUser = { username: "test", email: "test@text.com", password: "test1234" };
    const signup = await request(app).post('/api/auth/signup').send(testUser);
    expect(signup.statusCode).toBe(400)
    expect(signup.text).toContain('Email already exists')
  });

  test('POST /api/auth/signup should return internal server error', async () => {
    const testUser = { username: "test", password: "test1234" };
    const signup = await request(app).post('/api/auth/signup').send(testUser);
    expect(signup.statusCode).toBe(500)
  });

  test('POST /api/auth/signup should return successful login', async () => {
    const testUser = { email: "test@text.com", password: "test1234" };
    const signin = await request(app).post('/api/auth/signin').send(testUser);
    expect(signin.statusCode).toBe(200)
    expect(signin.text).toContain('"username":"test","email":"test@text.com"');
  });

  test('POST /api/auth/signup should return user not found', async () => {
    const testUser = { email: "test@gmail.com", password: "test1234" };
    const signin = await request(app).post('/api/auth/signin').send(testUser);
    expect(signin.statusCode).toBe(404)
    expect(signin.text).toContain('user not found !');
  });

  test('POST /api/auth/signup should return wrong credentials', async () => {
    const testUser = { email: "test@text.com", password: "test1444" };
    const signin = await request(app).post('/api/auth/signin').send(testUser);
    expect(signin.statusCode).toBe(403)
    expect(signin.text).toContain('wrong credentials !');
  });

  test('POST /api/auth/signin should return internal server error', async () => {
    const testUser = {email: "test@text.com" };
    const signin = await request(app).post('/api/auth/signin').send(testUser);
    expect(signin.statusCode).toBe(500)
  });

  test('GET /api/auth/signout should return signout sucessful', async () => {
    const signout = await request(app).get('/api/auth/signout');
    expect(signout.statusCode).toBe(200)
    expect(signout.text).toBe('"Signout success!"');
  });
});