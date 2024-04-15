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

@Scene('PHONE_EDIT_SCENE')
export class PhoneEditScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [[Markup.button.callback('👈 Cancel', 'back')]];

    let message: string = `*✏️ Edit Phone*\n\n`;

    message += `Type your phone number directly below\\.\n`;

    if ((ctx.scene.state as any).phone) {
      message += `You can also *click to copy* your existing phone number and paste it on the text field to make editing easier\\.\n\n`;

      message += `_Click to copy :_\n`;
      message += `👉 \`${(ctx.scene.state as any).phone}\` 👈`;
    }

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
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
    await this.saleService.editPhone(ctx.from!.id.toString(), msg.text);

    let message = `✅ Success\n\n`;
    message += `Your phone number has been successfully edited to \`${msg.text}\`\\.`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('PROFILE_SCENE', { edit_message: false });
  }
}
