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
import { ConfigService } from '@nestjs/config';
import {
  RESET_DAY,
  SALE_DAY,
  TIMEZONE,
  TODAY,
  TODAY_ISO,
} from '../sale.constant';
import { leaveScene, sendMessageWithKeyboard } from '../sale.common';
import { users } from '@prisma/client';
import { SaleService } from '../sale.service';

@Scene('WELCOME_SCENE')
export class WelcomeScene {
  constructor(
    private configService: ConfigService,
    private saleService: SaleService,
  ) {}

  @Start()
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

    const user_joined: boolean = [
      'creator',
      'administrator',
      'member',
    ].includes(
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

    let message: string = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${TODAY}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${SALE_DAY}\`\n`;
    message += `├ Reset Day : \`${RESET_DAY}\`\n`;
    message += `└ Timezone : \`${TIMEZONE}\`\n\n`;

    message += `*Sale Group*\n`;
    message += `├ Name : \`${group_title.title}\`\n`;
    message += `├ Joined : \`${user_joined ? 'Yes' : 'No'}\`\n`;
    message += `└ Link : [Click Here](${this.configService.get<string>('TELEGRAM_GROUP_LINK')})`;

    const user: users = {
      id: ctx.from!.id.toString(),
      username: ctx.from?.username ?? null,
      first_name: ctx.from!.first_name,
      last_name: ctx.from?.last_name ?? null,
      phone: null,
      created_at: TODAY_ISO,
      updated_at: TODAY_ISO,
    };
    this.saleService.createOrUpdateUser(user);

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
