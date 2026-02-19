import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '../src/common/pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';
import { migrateDb, resetDb } from './utils/db';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    jest.setTimeout(60000);
    // Set test database URL
    process.env.POSTGRES_URL = 'postgresql://postgres:3132@localhost:5432/devnest_test';

    // Migrate the test database
    migrateDb();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Mirror main.ts setup
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health', () => {
    it('should return status ok', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect({ status: 'ok' });
    });
  });

  describe('/auth', () => {
    const registerDto = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    describe('POST /register', () => {
      it('should register a new user', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto)
          .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.headers['set-cookie']).toBeDefined();
      });

      it('should fail if email already exists', async () => {
        // First registration
        await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto)
          .expect(201);

        // Second registration with same email
        await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto)
          .expect(409); // ConflictException
      });
    });

    describe('POST /login', () => {
      beforeEach(async () => {
        await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto);
      });

      it('should login successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginDto)
          .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.headers['set-cookie']).toBeDefined();
      });

      it('should fail with wrong password', async () => {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ ...loginDto, password: 'wrongpassword' })
          .expect(401); // UnauthorizedException
      });
    });
    
    describe('POST /refresh', () => {
      let refreshTokenCookie: string;

      beforeEach(async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto);
        
        // Extract refresh token cookie
        const cookies = response.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          refreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
        }
      });

      it('should refresh token using cookie', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/refresh')
          .set('Cookie', [refreshTokenCookie])
          .expect(201);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
      });
      
      it('should fail without cookie', async () => {
        await request(app.getHttpServer())
          .post('/api/v1/auth/refresh')
          .expect(401); // Assuming Unauthorized if guard is used or service throws
      });
    });

    describe('POST /logout', () => {
      let refreshTokenCookie: string;
      let accessToken: string;

      beforeEach(async () => {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(registerDto);
        
        const cookies = response.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          refreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
        }
        accessToken = response.body.accessToken;
      });

      it('should logout successfully', async () => {
         await request(app.getHttpServer())
          .post('/api/v1/auth/logout')
          .set('Cookie', [refreshTokenCookie])
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(201);
      });
    });
  });
});
