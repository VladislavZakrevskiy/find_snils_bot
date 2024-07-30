import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './bot.update';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HtmlParserService } from 'src/core/parser/parser.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_KEY'),
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [HtmlParserService, TelegramUpdate],
})
export class TelegramModule {}
