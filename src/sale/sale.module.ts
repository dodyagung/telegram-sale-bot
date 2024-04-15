import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SaleService } from './sale.service';
import { SaleScene } from './scene/sale/sale.scene';
import { WelcomeScene } from './scene/welcome.scene';
import { AboutScene } from './scene/about.scene';
import { TutorialScene } from './scene/tutorial.scene';
import { ProfileScene } from './scene/profile/profile.scene';
import { PhoneEditScene } from './scene/profile/phone/phone_edit.scene';
import { PhoneDeleteScene } from './scene/profile/phone/phone_delete.scene';
import { SaleAddScene } from './scene/sale/sale_add.scene';
import { SaleDeleteScene } from './scene/sale/sale_delete.scene';
import { SaleToggleScene } from './scene/sale/sale_toggle.scene';

@Module({
  providers: [
    SaleUpdate,
    SaleService,
    SaleScene,
    SaleAddScene,
    SaleToggleScene,
    SaleDeleteScene,
    WelcomeScene,
    ProfileScene,
    PhoneEditScene,
    PhoneDeleteScene,
    AboutScene,
    TutorialScene,
  ],
  imports: [ConfigModule, PrismaModule],
})
export class SaleModule {}
