const request = require('supertest');
const app = require('./index.js');
describe('Registration', () => {
  it('should successfully register a new user', async () => {
    const newUser = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };
    const response = await request(app).post('/regester/reg').send(newUser);
    expect(response.status).toBe(302);
  });
});
describe('Login', () => {
  it('should successfully log in an existing user', async () => {
    const existingUser = { username: 'testuser', password: 'testpassword' };
    const response = await request(app).post('/login/auth').send(existingUser);
    expect(response.status).toBe(302);
  });
  it('should fail to log in with incorrect credentials', async () => {
    const incorrectCredentials = { username: 'testuser', password: 'wrongpassword' };
    const response = await request(app).post('/login/auth').send(incorrectCredentials);
    expect(response.status).toBe(302);
  });
});
describe('Data Submission', () => {
  it('should handle errors during data submission', async () => {
    const response = await request(app).post('/dataobtain');
    expect(response.status).toBe(500);
  }, 10000);
});
