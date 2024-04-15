import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_TOGGLE_SCENE')
export class SaleToggleScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const all_sales = await this.saleService.getSales(ctx.from!.id.toString());

    const keyboard = [];
    all_sales.forEach((sale) => {
      keyboard.push([
        Markup.button.callback(
          `${sale.is_enabled ? '🟢' : '🔴'} ${sale.post}`,
          `toggle-sale-${sale.id}-${sale.is_enabled}`,
        ),
      ]);
    });
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message: string = `*🔄 Enable/Disable Sale*\n\n`;

    message += `Please click a sale that you want to toggle enable or disable\\.\n\n`;
    message += `_🟢 \\= sale is enabled_\n`;
    message += `_🔴 \\= sale is disabled_`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action(/toggle-sale-(\d+)-(true|false)/)
  async onSaleToggle(@Ctx() ctx: SceneContext): Promise<void> {
    const id: number = +(ctx as any).match[1];
    const is_enabled: boolean = (ctx as any).match[2] === 'true';

    await this.saleService.toggleSale(id, ctx.from!.id.toString(), !is_enabled);

    ctx.scene.reenter();
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
