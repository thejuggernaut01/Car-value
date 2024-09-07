import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // We need to make sure NODE_ENV is set before we start our project
      envFilePath: `.env.${process.env.NODE_ENV}` as string,
    }),
    TypeOrmModule.forRootAsync({
      // This tells the DI system that we want to find the configService
      // which should have all our config info inside of it from
      // our chosen file and we want to get access to that instance of
      // the configService during setup of our typeORM module.
      inject: [ConfigService],

      // This function is going t receive our instance of the configService.
      // This is the DI part
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          // never set to true in a prod environment
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    // type: 'sqlite',
    // database: 'db.sqlite',
    // entities: [User, Report],
    // // never set to true in a prod environment
    // synchronize: true,
    // }),
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
