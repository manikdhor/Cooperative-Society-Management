import request from 'supertest';
import { createApp } from '../app';

describe('API Gateway - Integration Tests', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('service', 'api-gateway');
    });
  });

  describe('GET /api/v1/members', () => {
    it('should return members list', async () => {
      const response = await request(app).get('/api/v1/members');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('members');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.members)).toBe(true);
    });

    it('should return correct content-type', async () => {
      const response = await request(app).get('/api/v1/members');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /api/v1/loans', () => {
    it('should return loans list', async () => {
      const response = await request(app).get('/api/v1/loans');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('loans');
      expect(response.body.data).toHaveProperty('total');
      expect(Array.isArray(response.body.data.loans)).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/unknown');

      expect(response.status).toBe(404);
    });
  });
});
