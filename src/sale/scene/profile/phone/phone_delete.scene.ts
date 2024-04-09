import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { sendMessage } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('PHONE_DELETE_SCENE')
export class PhoneDeleteScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [
      [Markup.button.callback('❌ Delete Now', 'phone_delete_confirm')],
      [Markup.button.callback('👈 Cancel and Back', 'back')],
    ];

    let message: string = `*❌ Delete Phone*\n\n`;

    message += `Are you sure you want to delete *${(await this.saleService.getPhone(ctx.from!.id.toString()))?.phone}*?\n\n`;

    message += `_You can always enable it again from Edit Phone menu\\._`;

    sendMessage(ctx, message, keyboard);
  }

  @Action('phone_delete_confirm')
  onPhoneDeleteConfirm(@Ctx() ctx: SceneContext): void {
    this.saleService.deletePhone(ctx.from!.id.toString());
    ctx.scene.enter('PROFILE_SCENE');
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
  }
}
