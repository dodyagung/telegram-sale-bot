import { Scene, SceneEnter, Ctx, Action, Hears, Start } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../../sale.common';
import { SaleService } from '../../sale.service';

@Scene('PROFILE_SCENE')
export class ProfileScene {
  constructor(private saleService: SaleService) {}

  private phone: string | null | undefined;

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    this.phone = (
      await this.saleService.getPhone(ctx.from!.id.toString())
    )?.phone;

    const keyboard = [];
    if (this.phone) {
      keyboard.push([
        Markup.button.callback('✏️ Edit', 'phone_edit'),
        Markup.button.callback('❌ Delete', 'phone_delete'),
      ]);
    } else {
      keyboard.push([Markup.button.callback('✏️ Edit', 'phone_edit')]);
    }
    keyboard.push([Markup.button.callback('👈 Back', 'back')]);

    let message: string = `**👤 My Profile**\n\n`;

    message += `This is your account information.\n`;
    message += `You can edit your **Telegram Info** via Telegram application settings.\n`;
    message += `For **Additional Info**, you can click Edit or Delete button bellow.\n\n`;

    message += `**Telegram Info**\n`;
    message += `├ ID : \`${ctx.from!.id}\`\n`;
    message += `├ Username : \`${ctx.from?.username ?? '<not set>'}\`\n`;
    message += `├ First Name : \`${ctx.from!.first_name}\`\n`;
    message += `└ Last Name : \`${ctx.from?.last_name ?? '<not set>'}\`\n\n`;

    message += `**Additional Info**\n`;
    message += `└ Phone : \`${this.phone ?? '<not set>'}\`\n\n`;

    sendMessageWithKeyboard(
      ctx,
      message,
      keyboard,
      (ctx.scene.state as any).edit_message,
    );
  }

  @Action('phone_edit')
  onPhoneEdit(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_EDIT_SCENE', { phone: this.phone });
  }

  @Action('phone_delete')
  onPhoneDelete(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_DELETE_SCENE', { phone: this.phone });
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
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
