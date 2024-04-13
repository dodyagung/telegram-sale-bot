import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_DELETE_SCENE')
export class SaleDeleteScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [
      [Markup.button.callback('❌ Delete Now', 'sale_delete_confirm')],
      [Markup.button.callback('👈 Cancel and Back', 'back')],
    ];

    let message: string = `*❌ Delete Sale*\n\n`;

    message += `Are you sure you want to delete?`;

    // message += `Are you sure you want to delete *${(await this.saleService.getPhone(ctx.from!.id.toString()))?.phone}*?\n\n`;

    // message += `_You can always enable it again from Edit Phone menu\\._`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('sale_delete_confirm')
  onSaleDeleteConfirm(@Ctx() ctx: SceneContext): void {
    // this.saleService.editPhone(ctx.from!.id.toString(), null);
    ctx.scene.enter('SALE_SCENE');
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
