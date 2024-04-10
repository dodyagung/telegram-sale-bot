import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../sale.common';

@Scene('SALE_SCENE')
export class SaleScene {
  @SceneEnter()
  onSceneEnter(@Ctx() ctx: SceneContext): void {
    const keyboard = [
      [
        Markup.button.callback('👈 Back', 'back'),
        Markup.button.callback('➕ Add', 'add'),
        Markup.button.callback('✏️ Edit', 'edit'),
        Markup.button.callback('❌ Delete', 'delete'),
      ],
    ];

    let message = `💰 Manage Sale\n\n`;

    message += `Here you can manage your Sale Post\\.\n\n`;

    message += `*Sale Post*\n`;
    message += `├ Enabled : \n`;
    message += `├ Disabled : \n`;
    message += `└ Total : \n\n`;

    message += `Below is the actual view that will be sent to the group\\.\n\n`;

    message += `💰 Dody\n`;
    message += `└ \\(No data\\)`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}
