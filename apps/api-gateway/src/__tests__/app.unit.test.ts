import { createApp } from '../app';

describe('API Gateway - Unit Tests', () => {
  describe('createApp', () => {
    it('should create an Express application', () => {
      const app = createApp();
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should have required middleware configured', () => {
      const app = createApp();
      expect(app._router).toBeDefined();
    });
  });
});
