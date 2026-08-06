import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';
import { UserRole } from '../constants/enums';
import { env } from '../config/env';
import { User } from '../models/User';

const base = `/api/${env.apiVersion}`;

let memoryServer: MongoMemoryServer;

let phoneCounter = 0;

const register = (email: string) => {
  phoneCounter += 1;
  return request(app)
    .post(`${base}/auth/register`)
    .send({
      firstName: 'Test',
      lastName: 'User',
      email,
      phone: `+23480123456${String(phoneCounter).padStart(2, '0')}`,
      password: 'Passw0rd123'
    });
};

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri(), { dbName: 'sgl_test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await memoryServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('public registration and login', () => {
  it('lets any new visitor register and sign back in', async () => {
    const created = await register('buyer@example.com');
    expect(created.status).toBe(201);
    expect(created.body.data.user.role).toBe(UserRole.Customer);

    const login = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'BUYER@example.com', password: 'Passw0rd123' });
    expect(login.status).toBe(200);
    expect(login.body.data.accessToken).toBeTruthy();
  });

  it('rejects a blocked account at login', async () => {
    await register('blocked@example.com');
    await User.updateOne({ email: 'blocked@example.com' }, { isBlocked: true });

    const login = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'blocked@example.com', password: 'Passw0rd123' });
    expect(login.status).toBe(403);
  });

  it('changes a password and invalidates the old one', async () => {
    const created = await register('rotate@example.com');
    const token = created.body.data.accessToken;

    const changed = await request(app)
      .post(`${base}/auth/change-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'Passw0rd123', newPassword: 'Newpassw0rd456' });
    expect(changed.status).toBe(200);

    const stale = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'rotate@example.com', password: 'Passw0rd123' });
    expect(stale.status).toBe(401);

    const fresh = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'rotate@example.com', password: 'Newpassw0rd456' });
    expect(fresh.status).toBe(200);
  });
});

describe('admin user management', () => {
  const adminLogin = async () => {
    await register('admin@example.com');
    await User.updateOne({ email: 'admin@example.com' }, { role: UserRole.Admin });
    const login = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'admin@example.com', password: 'Passw0rd123' });
    return login.body.data.accessToken as string;
  };

  it('lists users, promotes a sales manager and blocks a customer', async () => {
    const token = await adminLogin();
    const customer = await register('customer@example.com');
    const customerId = customer.body.data.user.id;

    const list = await request(app).get(`${base}/admin/users`).set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(2);
    expect(list.body.data[0].password).toBeUndefined();

    const promoted = await request(app)
      .patch(`${base}/admin/users/${customerId}/role`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: UserRole.Sales });
    expect(promoted.status).toBe(200);
    expect(promoted.body.data.role).toBe(UserRole.Sales);

    const blocked = await request(app)
      .patch(`${base}/admin/users/${customerId}/blocked`)
      .set('Authorization', `Bearer ${token}`)
      .send({ blocked: true });
    expect(blocked.status).toBe(200);
    expect(blocked.body.data.isBlocked).toBe(true);
  });

  it('keeps the user list away from sales managers', async () => {
    const adminToken = await adminLogin();
    const sales = await register('sales@example.com');
    await User.updateOne({ email: 'sales@example.com' }, { role: UserRole.Sales });
    const salesLogin = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: 'sales@example.com', password: 'Passw0rd123' });

    expect(sales.status).toBe(201);
    expect(adminToken).toBeTruthy();

    const denied = await request(app)
      .get(`${base}/admin/users`)
      .set('Authorization', `Bearer ${salesLogin.body.data.accessToken}`);
    expect(denied.status).toBe(403);
  });
});

describe('livestock management', () => {
  const staffToken = async (role: UserRole) => {
    await register(`${role}@farm.com`);
    await User.updateOne({ email: `${role}@farm.com` }, { role });
    const login = await request(app)
      .post(`${base}/auth/login`)
      .send({ email: `${role}@farm.com`, password: 'Passw0rd123' });
    return login.body.data.accessToken as string;
  };

  const animalPayload = {
    name: 'Yankasa Ram',
    category: 'ram',
    breed: 'Yankasa',
    description: 'A well finished Sallah ram raised on open pasture.',
    price: 350000,
    weightKg: 62,
    ageMonths: 18,
    gender: 'male',
    size: 'large',
    healthStatus: 'Healthy — vet checked',
    vaccinationStatus: 'Fully vaccinated',
    quantity: 3
  };

  it('lets sales staff create, edit, mark sold and remove an animal', async () => {
    const token = await staffToken(UserRole.Sales);

    const created = await request(app)
      .post(`${base}/animals`)
      .set('Authorization', `Bearer ${token}`)
      .send(animalPayload);
    expect(created.status).toBe(201);
    expect(created.body.data.sku).toBeTruthy();

    const id = created.body.data._id;

    const edited = await request(app)
      .patch(`${base}/animals/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 375000, status: 'sold' });
    expect(edited.status).toBe(200);
    expect(edited.body.data.price).toBe(375000);
    expect(edited.body.data.status).toBe('sold');

    const removed = await request(app).delete(`${base}/animals/${id}`).set('Authorization', `Bearer ${token}`);
    expect(removed.status).toBe(200);

    const gone = await request(app).get(`${base}/animals/${created.body.data.slug}`);
    expect(gone.status).toBe(404);
  });

  it('blocks customers from creating animals', async () => {
    const created = await register('shopper@example.com');
    const denied = await request(app)
      .post(`${base}/animals`)
      .set('Authorization', `Bearer ${created.body.data.accessToken}`)
      .send(animalPayload);
    expect(denied.status).toBe(403);
  });
});
