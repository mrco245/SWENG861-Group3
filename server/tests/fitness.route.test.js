import express from 'express';
import request from 'supertest';
import { afterAll, describe, expect, test } from 'vitest';
import fitnessRoutes from '../routes/fitness.route';
import userRoutes from '../routes/user.route';
import authRoutes from '../routes/auth.route';
import cookieParser from "cookie-parser";
import * as db from './db';

const app = new express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fitness', fitnessRoutes);

describe('Fitness Routes', () => {
  // Setup connection to the database
  beforeAll(async () => await db.connect());
  afterAll(async () => await db.closeDatabase());

  test('POST /api/fitness/cardio should return created cardio', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    const cardio = { type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: loginUser.body._id }
    const caridoCreate = await request(app).post('/api/fitness/cardio').send(cardio).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(caridoCreate.statusCode).toBe(200);
  });

  test('GET /api/fitness/cardio should return cardio details', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    //const registerUser = await request(app).post('/api/auth/signup').send(testUser);
   // expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    //const cardio = { type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: loginUser.body._id }
    const caridoGet = await request(app).get('/api/fitness/cardio/' + loginUser.body.cardio[0]).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(caridoGet.statusCode).toBe(200);
  });

  test('DELETE /api/fitness/cardio should return cardio deleted', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    //const registerUser = await request(app).post('/api/auth/signup').send(testUser);
   // expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    //const cardio = { type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: loginUser.body._id }
    const caridoGet = await request(app).delete('/api/fitness/cardio/' + loginUser.body.cardio[0]).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(caridoGet.statusCode).toBe(200);
  });

  test('POST /api/fitness/resistance should return created resistance', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    //const registerUser = await request(app).post('/api/auth/signup').send(testUser);
    //expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    const resistance = { type: "resistance", name: "lift", weight: 1, sets: 60, reps: 20, date: new Date(), userId: loginUser.body._id }
    const resistanceCreate = await request(app).post('/api/fitness/resistance').send(resistance).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(resistanceCreate.statusCode).toBe(200);
  });

  test('GET /api/fitness/resistance should return cardio details', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    //const registerUser = await request(app).post('/api/auth/signup').send(testUser);
   // expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    //const cardio = { type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: loginUser.body._id }
    const resistanceGet = await request(app).get('/api/fitness/resistance/' + loginUser.body.resistance[0]).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(resistanceGet.statusCode).toBe(200);
  });

  test('DELETE /api/fitness/resistance should return cardio deleted', async () => {
    const testUser = { username: "testFitt", email: "userFitt@test.com", password: "userFitt" };
    //const registerUser = await request(app).post('/api/auth/signup').send(testUser);
   // expect(registerUser.statusCode).toBe(201);
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    expect(loginUser.statusCode).toBe(200);
    //const cardio = { type: "cardio", name: "running", distance: 1, duration: 60, date: new Date(), userId: loginUser.body._id }
    const resistanceDelete = await request(app).delete('/api/fitness/resistance/' + loginUser.body.resistance[0]).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(resistanceDelete.statusCode).toBe(200);
  });
});