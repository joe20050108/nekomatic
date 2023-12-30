import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';
import axios from 'axios';
import { Bot } from '@tf2-automatic/bot-data';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  private bot: Bot;
  private ready: boolean;

  constructor(
    private readonly configService: ConfigService<Config>,
    private eventEmitter: EventEmitter2
  ) {}

  getBot(): Bot {
    return this.bot;
  }

  @OnEvent(`nekomatic.bot.ready`) onReady() {
    this.logger.log('onReady()');
    this.ready = true;
  }
  isReady(): boolean {
    return this.ready;
  }

  // Main Service Start Function
  async start(): Promise<void> {
    this.logger.debug('start()');
    this.logger.log('Starting Nekomatic...');

    this.logger.verbose(
      `Retrieving bot information from ${this.configService.getOrThrow<string>(
        'botUrl'
      )}`
    );
    await axios
      .get(`${this.configService.getOrThrow<string>('botUrl')}/bot`)
      .then((response) => {
        this.bot = response.data;
      })
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Got bot SteamID64 ${this.bot.steamid64}`);

    this.logger.verbose(
      `Sending access token to ${this.configService.getOrThrow<string>(
        'bptfManagerUrl'
      )}`
    );
    await axios
      .post(
        `${this.configService.getOrThrow<string>('bptfManagerUrl')}/tokens`,
        {
          steamid64: this.bot.steamid64,
          value: this.configService.getOrThrow<string>('bptfAccessToken'),
        }
      )
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Sent backpack.tf access token to bptf-manager`);

    this.logger.verbose(
      `Sending user agent to ${this.configService.getOrThrow<string>(
        'bptfManagerUrl'
      )}`
    );
    await axios
      .post(
        `${this.configService.getOrThrow<string>('bptfManagerUrl')}/agents/${
          this.bot.steamid64
        }/register`,
        {
          userAgent:
            'Nekomatic' +
            (this.configService.get<string>('customUserAgentHeader')
              ? ` - ${this.configService.get<string>('customUserAgentHeader')}`
              : ' - Trading done the cute way! :3'),
        }
      )
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Sent backpack.tf user agent to bptf-manager`);

    // Emit 'ready'
    this.eventEmitter.emit(`nekomatic.bot.ready`);
  }
}
