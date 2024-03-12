import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { SaleModule } from './sale/sale.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TelegrafModuleOptions> => ({
        token: configService.get<string>('TELEGRAM_SALE_BOT_TOKEN')!,
      }),
    }),
    SaleModule,
    ConfigModule.forRoot(),
    PrismaModule,
  ],
})
export class AppModule {}
