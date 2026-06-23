import { setupSwagger } from './swagger/setup';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT|| 3000;

  app.enableCors({
    origin: [
      'https://yt-summarizer-henna.vercel.app', 
      'http://localhost:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  await setupSwagger(app);
  
  await app.listen(port);
  app.init()

  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Swagger can be accessed on: http://localhost:${port}/docs`);
}
bootstrap();
