import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_DELETE_SCENE')
export class SaleDeleteScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const all_sales = await this.saleService.getSales(ctx.from!.id.toString());

    const keyboard = [];
    all_sales.forEach((sale) => {
      keyboard.push([
        Markup.button.callback(`${sale.post}`, `delete-sale-${sale.id}`),
      ]);
    });
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message: string = `*❌ Delete Sale*\n\n`;

    message += `Please click a sale that you want to delete\\.\n\n`;
    message += `_This can\'t be undone, but you can always add it again from Add Sale menu\\._`;

    sendMessageWithKeyboard(
      ctx,
      message,
      keyboard,
      (ctx.scene.state as any).edit_message,
    );
  }

  @Action(/delete-sale-(\d+)/)
  async onSaleDelete(@Ctx() ctx: SceneContext): Promise<void> {
    const id: number = +(ctx as any).match[1];

    ctx.scene.enter('SALE_DELETE_CONFIRM_SCENE', { id });
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_SCENE');
  }

  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
