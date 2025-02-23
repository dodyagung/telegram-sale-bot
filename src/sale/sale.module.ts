import { Module } from '@nestjs/common';
import { SaleUpdate } from './sale.update';
import { PrismaModule } from 'src/prisma/prisma.module';
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
import { SaleDeleteConfirmScene } from './scene/sale/sale_delete_confirm.scene';
import { SaleEditScene } from './scene/sale/sale_edit.scene';
import { SaleEditConfirmScene } from './scene/sale/sale_edit_confirm.scene';

@Module({
  providers: [
    SaleUpdate,
    SaleService,
    SaleScene,
    SaleAddScene,
    SaleEditScene,
    SaleEditConfirmScene,
    SaleToggleScene,
    SaleDeleteScene,
    SaleDeleteConfirmScene,
    WelcomeScene,
    ProfileScene,
    PhoneEditScene,
    PhoneDeleteScene,
    AboutScene,
    TutorialScene,
  ],
  imports: [PrismaModule],
})
export class SaleModule {}
