import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: 'sale',
      imports: [ConfigModule],
      inject: [ConfigService],
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
    }),
    SaleModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
