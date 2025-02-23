import {
  Scene,
  SceneEnter,
  Ctx,
  Action,
  Sender,
  Hears,
  Start,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { RESET_DAY, SALE_DAY, TIMEZONE, TODAY_LONG } from '../sale.constant';
import { leaveScene, sendMessageWithKeyboard } from '../sale.common';
import { SaleService } from '../sale.service';

@Scene('WELCOME_SCENE')
export class WelcomeScene {
  constructor(private saleService: SaleService) {}

  @Start()
  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: SceneContext,
    @Sender('username') username: string,
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

    const user_joined: boolean = [
      'creator',
      'administrator',
      'member',
    ].includes(
      (
        await ctx.telegram.getChatMember(
          process.env.TELEGRAM_GROUP_ID!,
          ctx.from!.id,
        )
      ).status,
    );

    const group_title: any = await ctx.telegram.getChat(
      process.env.TELEGRAM_GROUP_ID!,
    );

    let message: string = `**🏠 Welcome**\n\n`;
    message += `Hello **${firstName}${lastName ? ' ' + lastName : ''}**, I'm [telegram-sale-bot](https://github.com/dodyagung/telegram-sale-bot). Now is **${TODAY_LONG()}**, what can I help you today?\n\n`;

    message += `**Sale Time**\n`;
    message += `├ Sale Day : \`${SALE_DAY()}\`\n`;
    message += `├ Reset Day : \`${RESET_DAY()}\`\n`;
    message += `└ Timezone : \`${TIMEZONE()}\`\n\n`;

    message += `**Sale Group**\n`;
    message += `├ Name : \`${group_title.title}\`\n`;
    message += `├ Joined : \`${user_joined ? 'Yes' : 'No'}\`\n`;
    message += `└ Link : [Click Here](${process.env.TELEGRAM_GROUP_LINK})`;

    this.saleService.createOrUpdateUser(
      ctx.from!.id.toString(),
      username,
      firstName,
      lastName,
    );

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('sale')
  onSaleAction(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('SALE_SCENE');
  }

  @Action('profile')
  onProfileAction(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PROFILE_SCENE');
  }

  @Action('tutorial')
  onTutorialAction(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('TUTORIAL_SCENE');
  }

  @Action('about')
  onAboutAction(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('ABOUT_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
