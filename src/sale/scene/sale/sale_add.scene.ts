import {
  Scene,
  SceneEnter,
  Ctx,
  Action,
  Hears,
  Message,
  Start,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';
import { Prisma } from '@prisma/client';

@Scene('SALE_ADD_SCENE')
export class SaleAddScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Cancel', 'back')]];

    let message: string = `*➕ Add*\n\n`;

    message += `Type your sale directly below\\.`;

    sendMessageWithKeyboard(ctx, message, keyboard);
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
  async onFallback(
    @Ctx() ctx: SceneContext,
    @Message() msg: { text: string },
  ): Promise<void> {
    const sale: Prisma.postsUncheckedCreateInput = {
      user_id: ctx.from!.id.toString(),
      is_enabled: true,
      is_deleted: false,
      post: msg.text,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await this.saleService.addSale(sale);

    let message = `✅ Success\n\n`;
    message += `Your sale has been successfully added and enabled by default :\n\n`;
    message += `_${msg.text}_`;

    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('SALE_SCENE', { edit_message: false });
  }
}
