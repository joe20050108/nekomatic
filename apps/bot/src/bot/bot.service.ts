import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';
import axios from 'axios';
import { Bot } from '@tf2-automatic/bot-data';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  private bot: Bot;

  private readonly botUrl: string;
  private readonly bptfManagerUrl: string;
  private readonly accessToken: string;
  private readonly userAgent: string;

  constructor(
    private readonly configService: ConfigService<Config>,
    private eventEmitter: EventEmitter2
  ) {
    this.botUrl = this.configService.getOrThrow<string>('botUrl');
    this.bptfManagerUrl =
      this.configService.getOrThrow<string>('bptfManagerUrl');
    this.accessToken = this.configService.getOrThrow<string>('bptfAccessToken');
    this.userAgent =
      'Nekomatic' +
      (this.configService.get<string>('customUserAgentHeader')
        ? ` - ${this.configService.getOrThrow<string>('customUserAgentHeader')}`
        : ' - Trading done the cute way! :3');
  }

  getBot(): Bot {
    return this.bot;
  }

  // Main Service Start Function
  async start(): Promise<void> {
    this.logger.debug('start()');
    this.logger.log('Starting Nekomatic...');

    this.logger.verbose(`Retrieving bot information from ${this.botUrl}`);
    await axios
      .get(`${this.botUrl}/bot`)
      .then((response) => {
        this.bot = response.data;
      })
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Got bot SteamID64 ${this.bot.steamid64}`);

    this.logger.verbose(`Sending access token to ${this.bptfManagerUrl}`);
    await axios
      .post(`${this.bptfManagerUrl}/tokens`, {
        steamid64: this.bot.steamid64,
        value: this.accessToken,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Sent backpack.tf access token to bptf-manager`);

    this.logger.verbose(`Sending user agent to ${this.bptfManagerUrl}`);
    await axios
      .post(`${this.bptfManagerUrl}/agents/${this.bot.steamid64}/register`, {
        userAgent: this.userAgent,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new Error(error);
      });
    this.logger.log(`Sent backpack.tf user agent to bptf-manager`);

    // Emit 'ready'
    this.eventEmitter.emit(`nekomatic.bot.ready`);
  }
}
