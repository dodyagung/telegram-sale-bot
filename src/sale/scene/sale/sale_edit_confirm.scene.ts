import {
  Scene,
  SceneEnter,
  Ctx,
  Action,
  Hears,
  Start,
  Message,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('SALE_EDIT_CONFIRM_SCENE')
export class SaleEditConfirmScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Cancel', 'back')]];

    const sale = await this.saleService.getSale((ctx.scene.state as any).id);

    let message: string = `*✏️ Edit Sale*\n\n`;

    message += `Type your sale directly below\\.\n`;
    message += `You can also *click to copy* your existing sale and paste it on the text field to make editing easier\\.\n\n`;

    message += `_Click to copy :_\n`;
    message += `👉 \`${sale?.post}\` 👈`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_EDIT_SCENE');
  }

  @Start()
  onStart(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  async onFallback(
    @Ctx() ctx: SceneContext,
    @Message() msg: { text: string },
  ): Promise<void> {
    await this.saleService.editSale(
      (ctx.scene.state as any).id,
      ctx.from!.id.toString(),
      msg.text,
    );

    let message = `✅ Success\n\n`;
    message += `Your sale has been successfully edited to :\n\n`;
    message += `_${msg.text}_`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('SALE_SCENE', { edit_message: false });
  }
}
