import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SaleUpdate],
  imports: [ConfigModule, PrismaModule],
})
export class SaleModule {}
