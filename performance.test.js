const request = require('supertest');
const app = require('./index.js');


describe('Performance Test', () => {
  it('should respond within a reasonable time', async () => {
    const startTime = Date.now();
    const response = await request(app).get('/login');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Adjust the threshold as needed based on your performance requirements
    const responseTimeThreshold = 500; // 150ms

    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(responseTimeThreshold);
  });
});

