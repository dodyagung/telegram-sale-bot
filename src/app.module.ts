import { Module } from '@nestjs/common';
import { SentryModule } from '@sentry/nestjs/setup';
import { TelegrafModule } from 'nestjs-telegraf';
import { SaleModule } from './sale/sale.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { session } from 'telegraf';
import { Postgres } from '@telegraf/session/pg';
import { Pool } from 'pg';

const databaseUrl = new URL(process.env.DATABASE_URL!);
databaseUrl.searchParams.delete('sslmode');

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
              connectionString: databaseUrl.toString(),
              ssl: process.env.DATABASE_CA_CERTIFICATE
                ? {
                    ca: Buffer.from(process.env.DATABASE_CA_CERTIFICATE, 'base64').toString(),
                    rejectUnauthorized: true,
                  }
                : undefined,
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
