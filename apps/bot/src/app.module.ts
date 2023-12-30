import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { validation } from './common/config/validation';
import { BotModule } from './bot/bot.module';
import { DiscordModule } from './discord/discord.module';
import { EventsModule } from './events/events.module';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: validation,
    }),
    BotModule,
    DiscordModule,
    EventsModule,
    CommandsModule,
  ],
})
export class AppModule {}
