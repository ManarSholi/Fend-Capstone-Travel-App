import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../src/server/index.js';

describe('Server API Tests', () => {
    it('should respond to /data with a 200 status', async () => {
        const response = await request(app).get('/data');
        expect(response.statusCode).toBe(200);
    });

    it('should respond to / with a 200 status', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('should respond to /last-id with a 200 status', async () => {
        const response = await request(app).get('/last-id');
        expect(response.statusCode).toBe(200);
    });

    it('should respond to /delete-all-trips with a 200 status', async () => {
        const response = await request(app).delete('/delete-all-trips');
        expect(response.statusCode).toBe(200);
    });
});