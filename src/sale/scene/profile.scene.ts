import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { sendMessage } from '../sale.common';
import { SaleService } from '../sale.service';

@Scene('PROFILE_SCENE')
export class ProfileScene {
  constructor(private saleService: SaleService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('👈 Back', 'back')]];

    let message = `*👤 My Profile*\n\n`;

    message += `This is your account information\\. You can also edit, enable or disable your phone below\\.\n\n`;

    message += `*Telegram Info*\n`;
    message += `├ ID : \`${ctx.from!.id}\`\n`;
    message += `├ Username : \`${ctx.from?.username ?? '<not set>'}\`\n`;
    message += `├ First Name : \`${ctx.from!.first_name}\`\n`;
    message += `└ Last Name : \`${ctx.from?.last_name ?? '<not set>'}\`\n\n`;

    message += `*Additional Info*\n`;
    message += `└ Phone : \`${(await this.saleService.getUserPhone(ctx.from!.id.toString()))?.phone ?? '<not set>'}\`\n\n`;

    await sendMessage(ctx, message, keyboard);
  }

  @Action('back')
  async onBack(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('WELCOME_SCENE');
  }
}
