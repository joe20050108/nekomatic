import { Injectable, Logger } from '@nestjs/common';
import {
  Nack,
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import {
  FRIEND_MESSAGE_EVENT,
  FriendMessageEvent,
} from '@tf2-automatic/bot-data';
import { BotService } from '../bot/bot.service';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly botService: BotService, private readonly configService: ConfigService<Config>) {}

  @RabbitSubscribe({
    name: `nekomatic.bot.${FRIEND_MESSAGE_EVENT}`,
    queue: `nekomatic.bot.${FRIEND_MESSAGE_EVENT}`,
    exchange: `tf2-automatic.bot`,
    routingKey: FRIEND_MESSAGE_EVENT,
    allowNonJsonMessages: false,
    errorHandler: requeueErrorHandler,
  })
  async onFriendMessage(event: FriendMessageEvent) {
    if (!this.botService.isReady()) {
      return new Nack(true); // Requeue until the bot is ready to prevent unwanted errors
    }
    if (event.metadata.steamid64 !== this.botService.getBot().steamid64) {
      return new Nack(true); // Ignore messages meant for a different bot.
    } else {
      this.logger.verbose(
        `Got new message from ${event.data.steamid64}: ${event.data.message}`
      );
      if (event.data.message.startsWith(this.configService.get<string>("prefix") ? this.configService.getOrThrow<string>("prefix") : "!")) {
        console.log("eeee");
      }
    }
  }
}
