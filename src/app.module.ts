import { Module } from '@nestjs/common';
import appConfig from './config';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
