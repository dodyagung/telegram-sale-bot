import {
  Scene,
  SceneEnter,
  Ctx,
  Action,
  Hears,
  Message,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup, Scenes } from 'telegraf';
import {
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('PHONE_EDIT_SCENE')
export class PhoneEditScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Cancel and Back', 'back')]];

    let message: string = `*✏️ Edit Phone*\n\n`;

    message += `Type your phone number below, e\\.g\\. 08123456789\\.`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext, @Message() msg: { text: string }): void {
    this.saleService.editPhone(ctx.from!.id.toString(), msg.text);
    sendMessageWithoutKeyboard(
      ctx,
      `Successfuly edited the phone with ${msg.text}!`,
    );
    ctx.scene.enter('PROFILE_SCENE');
  }
}
