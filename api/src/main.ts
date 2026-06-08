import { setupSwagger } from './swagger/setup';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  await setupSwagger(app);
  
  await app.listen(port ?? 3000);
  app.init()

  console.log(`Application running on: http://localhost:${port}`);
}
bootstrap();
