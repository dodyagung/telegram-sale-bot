import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  leaveScene,
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_DELETE_CONFIRM_SCENE')
export class SaleDeleteConfirmScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [
      [
        Markup.button.callback(
          '❌ Delete',
          `sale-delete-confirm-${(ctx.scene.state as any).id}`,
        ),
      ],
      [Markup.button.callback('👈 Cancel', 'back')],
    ];

    const sale = await this.saleService.getSale((ctx.scene.state as any).id);

    let message: string = `*❌ Delete Sale*\n\n`;

    message += `Are you sure you want to delete this sale?\n\n`;
    message += `\`${sale!.post}\`\n\n`;
    message += `_This can\'t be undone, but you can always add it again from Add Sale menu\\._`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action(/sale-delete-confirm-(\d+)/)
  async onSaleDeleteConfirm(@Ctx() ctx: SceneContext): Promise<void> {
    const id: number = +(ctx as any).match[1];
    await this.saleService.deleteSale(id, ctx.from!.id.toString());

    let message = `✅ Success\n\n`;
    message += `Your sale has been successfully deleted\\.`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('SALE_SCENE', { edit_message: false });
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_DELETE_SCENE');
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
