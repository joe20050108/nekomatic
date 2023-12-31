import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Config, RabbitMQConfig } from '../common/config/configuration';
import { BotModule } from '../bot/bot.module';
import { FriendEventService } from './friend-event.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const rabbitmqConfig =
          configService.getOrThrow<RabbitMQConfig>('rabbitmq');
        return {
          uri: `amqp://${rabbitmqConfig.username}:${rabbitmqConfig.password}@${rabbitmqConfig.host}:${rabbitmqConfig.port}/${rabbitmqConfig.vhost}`,
        };
      },
    }),
    BotModule,
  ],
  providers: [FriendEventService],
})
export class EventsModule {}
