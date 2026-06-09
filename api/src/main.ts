import { setupSwagger } from './swagger/setup';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT|| 3000;

  await setupSwagger(app);
  
  await app.listen(port);
  app.init()

  console.log(`Application running on: http://localhost:${port}`);
}
bootstrap();
