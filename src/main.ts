import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['wjdiwswiswsw'],
    }),
  );

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
