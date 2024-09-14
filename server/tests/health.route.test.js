import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

import healthRoute from '../routes/health.route';

const app = new express();
app.use('/api/healthz', healthRoute);

describe('Health Routes', () => {
  it('GET /api/healthz should return the app is working', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'App is working');
  });
});