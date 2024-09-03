import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // it makes sure the incoming request doesn't have data
      // we're not expecting. so any additional property would
      // be stripped off
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
