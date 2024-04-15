import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import {
  leaveScene,
  sendMessageWithKeyboard,
  sendMessageWithoutKeyboard,
} from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('PHONE_DELETE_SCENE')
export class PhoneDeleteScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [
      [Markup.button.callback('❌ Delete', 'phone-delete-confirm')],
      [Markup.button.callback('👈 Cancel', 'back')],
    ];

    let message: string = `*❌ Delete Phone*\n\n`;

    message += `Are you sure you want to delete *${(ctx.scene.state as any).phone}*?\n\n`;

    message += `_This can\'t be undone, but you can always enable it again from Edit Phone menu\\._`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('phone-delete-confirm')
  async onPhoneDeleteConfirm(@Ctx() ctx: SceneContext): Promise<void> {
    await this.saleService.editPhone(ctx.from!.id.toString(), null);

    let message = `✅ Success\n\n`;
    message += `Your phone number has been successfully deleted\\.`;
    sendMessageWithoutKeyboard(ctx, message);

    ctx.scene.enter('PROFILE_SCENE', { edit_message: false });
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
