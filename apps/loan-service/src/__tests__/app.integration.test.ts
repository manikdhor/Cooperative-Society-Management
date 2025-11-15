import request from 'supertest';
import { createApp } from '../app';

describe('Loan Service - Integration Tests', () => {
  const app = createApp();

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data).toHaveProperty('service', 'loan-service');
    });
  });

  describe('POST /loans', () => {
    it('should create a new loan', async () => {
      const loanData = {
        memberId: 'member-123',
        amount: 10000,
        interestRate: 5,
        term: 12,
      };

      const response = await request(app)
        .post('/loans')
        .send(loanData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.amount).toBe(loanData.amount);
      expect(response.body.data.status).toBe('PENDING');
    });
  });

  describe('GET /loans', () => {
    it('should return all loans', async () => {
      const response = await request(app).get('/loans');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /loans/:id', () => {
    it('should return 404 for non-existent loan', async () => {
      const response = await request(app).get('/loans/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message', 'Loan not found');
    });

    it('should return loan by id', async () => {
      const createResponse = await request(app)
        .post('/loans')
        .send({
          memberId: 'member-456',
          amount: 5000,
          interestRate: 4.5,
          term: 24,
        });

      const loanId = createResponse.body.data.id;

      const response = await request(app).get(`/loans/${loanId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(loanId);
    });
  });

  describe('POST /loans/:id/approve', () => {
    it('should approve a pending loan', async () => {
      const createResponse = await request(app)
        .post('/loans')
        .send({
          memberId: 'member-789',
          amount: 7500,
          interestRate: 5.5,
          term: 18,
        });

      const loanId = createResponse.body.data.id;

      const response = await request(app).post(`/loans/${loanId}/approve`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('APPROVED');
      expect(response.body.data).toHaveProperty('approvalDate');
    });

    it('should return 400 for non-existent loan', async () => {
      const response = await request(app).post('/loans/non-existent/approve');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
