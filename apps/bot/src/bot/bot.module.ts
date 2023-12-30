import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
