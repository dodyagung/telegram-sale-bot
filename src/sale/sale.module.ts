import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SaleService } from './sale.service';
import { SaleWizard } from './sale.wizard';
import { SaleScene } from './scene/sale.scene';
import { WelcomeScene } from './scene/welcome.scene';

@Module({
  providers: [SaleUpdate, SaleService, SaleWizard, SaleScene, WelcomeScene],
  imports: [ConfigModule, PrismaModule],
})
export class SaleModule {}
