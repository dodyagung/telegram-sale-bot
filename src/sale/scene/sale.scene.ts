import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Context, Markup } from 'telegraf';
import { SaleUpdate } from '../sale.update';

@Scene('SALE_SCENE')
export class SaleScene {
  constructor(private saleUpdate: SaleUpdate) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context): Promise<void> {
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('🔙 Back', 'back'),
        // Markup.button.callback('👤 My Profile', 'profile'),
      ],
      // [
      //   Markup.button.callback('❓ Tutorial', 'tutorial'),
      //   Markup.button.callback('🤖 About', 'about'),
      // ],
    ]);

    await ctx.editMessageText('this is sale scene', {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: keyboard.reply_markup,
    });
  }

  @Action('back')
  async onBack(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('WELCOME_SCENE');
  }
}
