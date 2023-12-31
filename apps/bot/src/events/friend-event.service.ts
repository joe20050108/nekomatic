import { Injectable, Logger } from '@nestjs/common';
import { BotService } from '../bot/bot.service';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';
import {
  Nack,
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import {
  FRIEND_MESSAGE_EVENT,
  FriendMessageEvent,
} from '@tf2-automatic/bot-data';
import axios from 'axios';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FriendEventService {
  private readonly logger = new Logger(FriendEventService.name);
  private ready: boolean; // Ready to handle events

  constructor(
    private readonly botService: BotService,
    private readonly configService: ConfigService<Config>
  ) {}

  @OnEvent('nekomatic.bot.ready') onReady() {
    this.logger.debug('onReady()');
    this.ready = true;
  }

  /* --- FRIEND MESSAGE EVENT --- */
  @RabbitSubscribe({
    name: `nekomatic.bot.${FRIEND_MESSAGE_EVENT}`,
    queue: `nekomatic.bot.${FRIEND_MESSAGE_EVENT}`,
    exchange: `tf2-automatic.bot`,
    routingKey: FRIEND_MESSAGE_EVENT,
    allowNonJsonMessages: false,
    errorHandler: requeueErrorHandler,
  })
  async onFriendMessage(event: FriendMessageEvent) {
    if (!this.ready) {
      return new Nack(true); // Requeue until the bot is ready to prevent unwanted errors
    }
    if (event.metadata.steamid64 !== this.botService.getBot().steamid64) {
      return new Nack(true); // Ignore messages meant for a different bot.
    } else {
      this.logger.verbose(
        `Got new message from ${event.data.steamid64}: ${event.data.message}`
      );
      if (
        event.data.message.startsWith(
          this.configService.get<string>('prefix')
            ? this.configService.getOrThrow<string>('prefix')
            : '!'
        )
      ) {
        await axios.post(
          `${this.configService.getOrThrow<string>('botUrl')}/friends/${
            event.data.steamid64
          }/typing`
        );
        await axios.post(
          `${this.configService.getOrThrow<string>('botUrl')}/friends/${
            event.data.steamid64
          }/message`,
          {
            message: 'Nekomatic - Trading don- NYAH~?!',
          }
        );
        return new Nack(false);
      }
    }
  }
}
