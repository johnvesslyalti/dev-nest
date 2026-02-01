import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Serve static files from uploads directory (assuming it's in root/uploads)
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), { // Adjust as needed, existing was maybe root/uploads or frontend/public?
     // Wait, the existing code: `const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;`
     // This implies there is a folder served at /uploads.
     // If uploads are in project root/uploads, we serve that.
     // Let's assume project root is 2 dirs up from dist/src (dist/main.js -> dist -> root)
     prefix: '/uploads',
  });
  // Actually, join(__dirname, '..', '..', 'uploads')
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
