import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      // never set to true in a prod environment
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // This is how we setup a global pipe from inside our app module

      // Whenever we create an instance of our app module, take the value
      // of useValue, apply it to every incoming req that flows into our app
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // it makes sure the incoming request doesn't have data
        // we're not expecting. so any additional property would
        // be stripped off
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // This configure function will be called automatically whenever our app
  // starts listening for incoming traffic
  configure(consumer: MiddlewareConsumer) {
    // Inside here we can setup some middleware that will run on
    // every single incoming request
    consumer
      .apply(
        cookieSession({
          keys: ['wjdiwswiswsw'],
        }),
      )
      .forRoutes('*');
    // forRoutes('*') means make use of this middleware on every
    // single incoming request that flows into our entire app.
  }
}
