const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
    test('AUTH_05 - Login success', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: '123456'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.accessToken).toBeDefined();
    });

    test('AUTH_06 - Login wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@gmail.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('AUTH_10 - Access protected API without token', async () => {
        const res = await request(app)
            .get('/api/users/profile');

        expect(res.statusCode).toBe(401);
    });
});
