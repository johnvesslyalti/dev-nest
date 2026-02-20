import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './utils/app';
import { migrateDb, resetDb, seedTestData, SeededData } from './utils/db';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Feed (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let seed: SeededData;

  beforeAll(async () => {
    process.env.POSTGRES_URL = 'postgresql://postgres:3132@localhost:5432/devnest_test';
    migrateDb();
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await resetDb(prisma);
    seed = await seedTestData(app, prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Happy-path ────────────────────────────────────────────────

  describe('GET /api/v1/feed', () => {
    it('should return posts from followed users', async () => {
      // userA follows userB (seeded), userB has a post
      const res = await request(app.getHttpServer())
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${seed.tokenA}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('author');
      expect(res.body[0].author).toHaveProperty('username', 'userb');
    });

    it('should return empty feed when user follows nobody', async () => {
      // userB does not follow anyone
      const res = await request(app.getHttpServer())
        .get('/api/v1/feed')
        .set('Authorization', `Bearer ${seed.tokenB}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  // ── Negative tests ────────────────────────────────────────────

  describe('GET /api/v1/feed — negative', () => {
    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/feed')
        .expect(401);
    });
  });
});
