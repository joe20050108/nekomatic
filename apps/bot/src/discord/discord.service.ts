import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Operator } from '../common/config/configuration';
import { Once, Context, ContextOf } from 'necord';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  constructor(private readonly configService: ConfigService<Config>) {}

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
    // Create a DM with the operator's discord ID.
    await client.users
      .fetch(this.configService.getOrThrow<Operator>('operator').discord)
      .then((operatorUser) => {
        client.users
          .createDM(operatorUser)
          .then(() => {
            this.logger.log(
              `Created DM channel with operator ${operatorUser.username}`
            );
          })
          .catch((error) => {
            this.logger.error(
              'Failed to fetch DM channel with operator:',
              error
            );
          });
      })
      .catch((error) => {
        this.logger.error('Failed to fetch DM channel with operator:', error);
      });
  }
}
