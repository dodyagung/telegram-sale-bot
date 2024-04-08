import { Scene, SceneEnter, Ctx, Action, Sender } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { RESET_DAY, SALE_DAY, TIMEZONE, TODAY } from '../sale.constant';
import { sendMessage } from '../sale.common';

@Scene('WELCOME_SCENE')
export class WelcomeScene {
  constructor(private configService: ConfigService) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: SceneContext,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
  ): Promise<void> {
    const keyboard = [
      [
        Markup.button.callback('💰 My Sale', 'sale'),
        Markup.button.callback('👤 My Profile', 'profile'),
      ],
      [
        Markup.button.callback('❓ Tutorial', 'tutorial'),
        Markup.button.callback('🤖 About', 'about'),
      ],
    ];

    const user_joined = ['creator', 'administrator', 'member'].includes(
      (
        await ctx.telegram.getChatMember(
          this.configService.get<string>('TELEGRAM_GROUP_ID')!,
          ctx.from!.id,
        )
      ).status,
    );

    const group_title: any = await ctx.telegram.getChat(
      this.configService.get<string>('TELEGRAM_GROUP_ID')!,
    );

    let message = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${TODAY}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${SALE_DAY}\`\n`;
    message += `├ Reset Day : \`${RESET_DAY}\`\n`;
    message += `└ Timezone : \`${TIMEZONE}\`\n\n`;

    message += `*Sale Group*\n`;
    message += `├ Name : \`${group_title.title}\`\n`;
    message += `├ Joined : \`${user_joined ? 'Yes' : 'No'}\`\n`;
    message += `└ Link : [Click Here](${this.configService.get<string>('TELEGRAM_GROUP_LINK')})`;

    await sendMessage(ctx, message, keyboard, !ctx.callbackQuery);
  }

  @Action('sale')
  async onSaleAction(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('SALE_SCENE');
  }

  @Action('profile')
  async onProfileAction(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('PROFILE_SCENE');
  }

  @Action('tutorial')
  async onTutorialAction(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('TUTORIAL_SCENE');
  }

  @Action('about')
  async onAboutAction(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('ABOUT_SCENE');
  }
}
