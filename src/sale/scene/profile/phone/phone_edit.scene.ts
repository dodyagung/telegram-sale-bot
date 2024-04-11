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

@Scene('PHONE_EDIT_SCENE')
export class PhoneEditScene {
  constructor(private saleService: SaleService) {}

  async getPhone(@Ctx() ctx: SceneContext): Promise<string | null | undefined> {
    return (await this.saleService.getPhone(ctx.from!.id.toString()))?.phone;
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Cancel and Back', 'back')]];

    let message: string = `*✏️ Edit Phone*\n\n`;

    message += `Type your phone number directly below\\.\n`;

    if (await this.getPhone(ctx)) {
      message += `You can also copy your existing phone number and paste it on the text field to make editing easier\\.\n\n`;

      message += `\`\`\`\n`;
      message += `${await this.getPhone(ctx)}\n`;
      message += `\`\`\``;
    }

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext, @Message() msg: { text: string }): void {
    this.saleService.editPhone(ctx.from!.id.toString(), msg.text);

    let message = `✅ Success\n\n`;
    message += `Your phone number has been successfully edited to \`${msg.text}\`\\.`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('PROFILE_SCENE');
  }
}
