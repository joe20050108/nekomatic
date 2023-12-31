import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { validation } from './common/config/validation';
import { BotModule } from './bot/bot.module';
import { EventsModule } from './events/events.module';
import { CommandsModule } from './commands/commands.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: validation,
    }),
    BotModule,
    EventsModule,
    CommandsModule,
    StorageModule,
  ],
})
export class AppModule {}
