import express from 'express';
import request from 'supertest';
import { afterAll, describe, expect, test } from 'vitest';
import bmiRoutes from '../routes/bmi.route';
import authRoutes from '../routes/auth.route';
import cookieParser from "cookie-parser";
import * as db from './db';

const app = new express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/bmi', bmiRoutes);

describe('BMI Routes', () => {
  beforeAll(async () => await db.connect());
  afterAll(async () => await db.closeDatabase());

  test('POST /api/bmi should create a BMI entry', async () => {
    const testUser = { username: "testUser", email: "user@test.com", password: "password" };
    await request(app).post('/api/auth/signup').send(testUser);
    const loginResponse = await request(app).post('/api/auth/signin').send(testUser);
    
    const bmiData = { userId: loginResponse.body._id, bmi: 22.5, date: new Date() };
    const response = await request(app).post('/api/bmi').send(bmiData).set('Cookie', loginResponse.headers['set-cookie'][0]);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'BMI entry successfully created!');

  });

  test('GET /api/bmi/user/:userId should return BMI history for a user', async () => {
    const testUser = { username: "testUser", email: "user@test.com", password: "password" };
    // Simulate user login
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);
    
    expect(loginUser.statusCode).toBe(200);
  
    // Use the user ID from the login response
    const userId = loginUser.body._id; // Adjust based on your actual response structure
  
    // Fetch BMI history using the cookie from the login
    const bmiHistory = await request(app)
      .get(`/api/bmi/user/${userId}`)
      .set('Cookie', loginUser.headers['set-cookie'][0]); // Pass the session cookie
    
    expect(bmiHistory.statusCode).toBe(200);
    expect(bmiHistory.body).toBeInstanceOf(Array); // Check if it returns an array
  });

  test('DELETE api/bmi/:id should delete a BMI entry', async () => {

    const testUser = { username: "testUser", email: "user@test.com", password: "password" };
    // Simulate user login
    const loginUser = await request(app).post('/api/auth/signin').send(testUser);

    expect(loginUser.statusCode).toBe(200);
    const userId = loginUser.body._id; 
    
    const bmiData = { userId: userId, bmi: 22.5, date: new Date() };
    const response = await request(app).post('/api/bmi').send(bmiData).set('Cookie', loginUser.headers['set-cookie'][0]);
    
    expect(response.statusCode).toBe(200);

    console.log(response.body)
    const bmiId = response.body.bmiId

    const deleteresponse =  await request(app).delete(`/api/bmi/${bmiId}`).set('Cookie', loginUser.headers['set-cookie'][0]);
    expect(deleteresponse.statusCode).toBe(200);
    



  });
  
  
});
