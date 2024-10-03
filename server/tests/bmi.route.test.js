import express from 'express';
import request from 'supertest';
import { describe, expect, test, beforeAll, afterAll } from 'vitest';
import bmiRoutes from '../routes/bmi.route';
import * as db from './db'; // Assuming db setup utilities

const app = new express();
app.use(express.json());
app.use('/api/bmi', bmiRoutes);

describe('BMI Routes', () => {
  beforeAll(async () => await db.connect()); // Connect to test database
  afterAll(async () => await db.closeDatabase()); // Close test database

  test('POST /api/bmi should create BMI entry', async () => {
    const userData = { userId: '123', bmi: 22.5, date: new Date() };
    const response = await request(app).post('/api/bmi').send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('bmi', 22.5);
  });

});
