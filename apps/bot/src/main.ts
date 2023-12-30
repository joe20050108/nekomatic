console.log('Meow? :3');
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Config } from './common/config/configuration';
import { BotService } from './bot/bot.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.DEBUG === 'true'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['log', 'warn', 'error'],
  });

  const config = new DocumentBuilder()
    .setTitle('Bot API Documentation')
    .setDescription('The documentation for the bot API')
    .setVersion('current')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService: ConfigService<Config> = app.get(ConfigService);
  const botService: BotService = app.get(BotService);

  app.enableShutdownHooks();

  const port = configService.getOrThrow<number>('port');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  try {
    await app.init();
  } catch (err) {
    Logger.error('Failed to initialize application');
    console.error(err);
    await app.close();
    process.exit(1);
  }

  // Start bot after everything else to make sure events will be caught and handled properly
  try {
    await botService.start();
  } catch (err) {
    Logger.error('Failed to start bot');
    console.error(err);
    await app.close();
    process.exit(1);
  }

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
