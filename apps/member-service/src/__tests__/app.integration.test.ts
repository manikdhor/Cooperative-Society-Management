import request from 'supertest';
import { createApp } from '../app';

describe('Member Service - Integration Tests', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('service', 'member-service');
    });
  });

  describe('POST /members', () => {
    it('should create a new member', async () => {
      const memberData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        membershipNumber: 'MEM001',
      };

      const response = await request(app)
        .post('/members')
        .send(memberData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.firstName).toBe(memberData.firstName);
      expect(response.body.data.email).toBe(memberData.email);
    });
  });

  describe('GET /members', () => {
    it('should return all members', async () => {
      const response = await request(app).get('/members');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /members/:id', () => {
    it('should return 404 for non-existent member', async () => {
      const response = await request(app).get('/members/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message', 'Member not found');
    });

    it('should return member by id', async () => {
      const createResponse = await request(app)
        .post('/members')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: '9876543210',
          membershipNumber: 'MEM002',
        });

      const memberId = createResponse.body.data.id;

      const response = await request(app).get(`/members/${memberId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(memberId);
    });
  });
});
