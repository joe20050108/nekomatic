import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { NecordModule } from 'necord';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';
import { GatewayIntentBits } from 'discord.js';

@Module({
  imports: [
    NecordModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const token = configService.getOrThrow<string>('discordBotToken');
        return {
          token,
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
          ],
          prefix: configService.get<string>('prefix')
            ? configService.getOrThrow<string>('prefix')
            : '!',
        };
      },
    }),
  ],
  providers: [DiscordService],
})
export class DiscordModule {}
