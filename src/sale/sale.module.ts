import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';

@Module({
  providers: [SaleUpdate],
})
export class SaleModule {}
