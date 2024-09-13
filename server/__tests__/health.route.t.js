import request from 'supertest';
import express from 'express';

import healthRoute from '../routes/health.route';

const app = new express();
app.use('/api/healthz', healthRoute);

describe('Good Home Routes', function () {

  test('responds to /healthz', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual('App is working');
  });
});