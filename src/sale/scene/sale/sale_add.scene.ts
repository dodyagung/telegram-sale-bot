import {
  Scene,
  SceneEnter,
  Ctx,
  Action,
  Hears,
  Message,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';
import { Prisma } from '@prisma/client';
import { TODAY_ISO } from 'src/sale/sale.constant';

@Scene('SALE_ADD_SCENE')
export class SaleAddScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Cancel and Back', 'back')]];

    let message: string = `*➕ Add*\n\n`;

    message += `Type your sale post directly below\\.`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext, @Message() msg: { text: string }): void {
    const post: Prisma.postsUncheckedCreateInput = {
      user_id: ctx.from!.id.toString(),
      is_enabled: true,
      is_deleted: true,
      post: msg.text,
      created_at: TODAY_ISO,
      updated_at: TODAY_ISO,
    };
    this.saleService.addPost(post);

    let message = `✅ Success\n\n`;
    message += `Your sale post has been successfully added and enabled by default\\.`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('SALE_SCENE');
  }
}
