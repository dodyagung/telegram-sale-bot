import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { sendMessage } from 'src/sale/sale.common';
import { SaleService } from 'src/sale/sale.service';

@Scene('PHONE_EDIT_SCENE')
export class PhoneEditScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [
      [
        Markup.button.callback('✏️ Edit Phone', 'phone_edit'),
        Markup.button.callback('❌ Delete Phone', 'phone_delete'),
      ],
      [Markup.button.callback('👈 Back', 'back')],
    ];

    let message: string = `*👤 My Profile*\n\n`;

    message += `This is your account information\\. You can also edit or delete your phone below\\.\n\n`;

    message += `*Telegram Info*\n`;
    message += `├ ID : \`${ctx.from!.id}\`\n`;
    message += `├ Username : \`${ctx.from?.username ?? '<not set>'}\`\n`;
    message += `├ First Name : \`${ctx.from!.first_name}\`\n`;
    message += `└ Last Name : \`${ctx.from?.last_name ?? '<not set>'}\`\n\n`;

    message += `*Additional Info*\n`;
    message += `└ Phone : \`${(await this.saleService.getPhone(ctx.from!.id.toString()))?.phone ?? '<not set>'}\`\n\n`;

    sendMessage(ctx, message, keyboard);
  }

  @Action('phone_edit')
  onPhoneEdit(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_EDIT_SCENE');
  }

  @Action('phone_delete')
  onPhoneDelete(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_DELETE_SCENE');
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }
}
