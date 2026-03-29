import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "./common/pipes/validation.pipe";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import * as cluster from 'cluster';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api/v1");
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get("PORT") || 3001;

  const config = new DocumentBuilder()
    .setTitle("DevNest API")
    .setDescription("The API documentation for DevNest services.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(port);
  console.log(`Worker ${process.pid} started on port ${port}`);
}

// Ensure the cluster properly types using node's cluster module
const clusterModule = cluster as unknown as cluster.Cluster;

if (clusterModule.isPrimary) {
  const cpuCount = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${cpuCount} workers...`);

  for (let i = 0; i < cpuCount; i++) {
    clusterModule.fork();
  }

  clusterModule.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
    clusterModule.fork();
  });
} else {
  bootstrap();
}
