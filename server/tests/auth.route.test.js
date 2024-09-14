import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.route';

const app = new express();
app.use(express.json());
app.use('/api/auth', authRoutes);

import * as db from './db'

// Setup connection to the database
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe('Auth Routes', () => {
  it('POST /api/auth/signup', async () => {
    const testUser = {username: "test", email: "test@text.com", password:"test1234"};
    const res = await request(app).post('/api/auth/signup').send(testUser);
    expect(res.statusCode).toBe(201);

  });
});