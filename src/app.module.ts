import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { TelegrafModule } from 'nestjs-telegraf';
import { SaleModule } from './sale/sale.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { session } from 'telegraf';
import { Postgres } from '@telegraf/session/pg';
import { Pool } from 'pg';

@Module({
  imports: [
    SentryModule.forRoot(),
    PrismaModule,
    SaleModule,
    ScheduleModule.forRoot(),
    TelegrafModule.forRoot({
      middlewares: [
        session({
          store: Postgres({
            pool: new Pool({
              connectionString: process.env.DATABASE_URL,
            }),
            table: 'sessions',
          }),
        }),
      ],
      token: process.env.TELEGRAM_SALE_BOT_TOKEN!,
    }),
  ],
})
export class AppModule {}
