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
  afterEach(async () => await db.clearDatabase());
  afterAll(async () => await db.closeDatabase());

  test('POST /api/auth/signup should return user created', async () => {
    const testUser = { username: "test", email: "test@text.com", password: "test1234" };
    const signup = await request(app).post('/api/auth/signup').send(testUser);
    expect(signup.statusCode).toBe(201)
    expect(signup.body.message).toBe('User created successfully !');
  });
});