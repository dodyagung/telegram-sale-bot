import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { SaleModule } from './sale/sale.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: 'sale',
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TelegrafModuleOptions> => ({
        token: configService.get<string>('TELEGRAM_SALE_BOT_TOKEN')!,
        include: [SaleModule],
        launchOptions: {
          webhook: {
            domain: configService.get<string>('TELEGRAM_SALE_BOT_WEBHOOK')!,
            hookPath: '/',
          },
        },
      }),
      inject: [ConfigService],
    }),
    SaleModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
  ],
})
export class AppModule {}
