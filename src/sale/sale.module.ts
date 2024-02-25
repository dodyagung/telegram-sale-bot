import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SaleService } from './sale.service';

@Module({
  providers: [SaleUpdate, SaleService],
  imports: [ConfigModule, PrismaModule],
})
export class SaleModule {}
