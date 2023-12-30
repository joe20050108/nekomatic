import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Config, RabbitMQConfig } from '../common/config/configuration';
import { BotModule } from '../bot/bot.module';

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
  providers: [EventsService],
})
export class EventsModule {}
