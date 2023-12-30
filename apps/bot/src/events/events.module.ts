import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Config, RabbitMQConfig } from '../common/config/configuration';

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
  ],
  providers: [EventsService],
})
export class EventsModule {}
