import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../common/config/configuration';
import axios from 'axios';
import { Bot } from '@tf2-automatic/bot-data';
@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  private bot: Bot;

  constructor(private readonly configService: ConfigService<Config>) {}

  getBot(): Bot {
    return this.bot;
  }

  // Main Service Start Function
  async start(): Promise<void> {
    this.logger.debug(
      `Getting bot from ${this.configService.getOrThrow<string>('botUrl')}/bot`
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
    this.logger.debug(
      `Submitting backpack.tf access token to ${this.configService.getOrThrow<string>(
        'bptfManagerUrl'
      )}/tokens`
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
    this.logger.log(`Saved backpack.tf access token`);
    this.logger.debug(`Registering backpack.tf user agent`);
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
    this.logger.log(`Registered backpack.tf user agent`);
  }
}
