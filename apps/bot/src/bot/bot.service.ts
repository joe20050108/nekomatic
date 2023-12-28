import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from '@tf2-automatic/bot-data';
import { Config } from '../common/config/configuration';
import axios from 'axios';
@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);
  constructor(private readonly configService: ConfigService<Config>) {}
  async getBot(): Promise<Bot> {
    return await axios
      .get(`${this.configService.getOrThrow<string>('botUrl')}/bot`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        this.logger.error(err);
        return err;
      });
  }
}
