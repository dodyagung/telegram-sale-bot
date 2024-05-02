import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_EDIT_SCENE')
export class SaleEditScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const all_sales = await this.saleService.getSalesSortedByText(
      ctx.from!.id.toString(),
    );

    const keyboard = [];
    all_sales.forEach((sale) => {
      keyboard.push([
        Markup.button.callback(
          `${sale.post.replace(/\n/g, ' ')}`,
          `edit-sale-${sale.id}`,
        ),
      ]);
    });
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message: string = `**✏️ Edit Sale**\n\n`;

    message += `Please click a sale that you want to edit.`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action(/edit-sale-(\d+)/)
  async onSaleEdit(@Ctx() ctx: SceneContext): Promise<void> {
    const id: number = +(ctx as any).match[1];

    ctx.scene.enter('SALE_EDIT_CONFIRM_SCENE', { id });
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
