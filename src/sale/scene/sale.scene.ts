import { Scene, SceneEnter, Ctx, Action } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { SaleUpdate } from '../sale.update';
import { editMessage } from '../sale.common';

@Scene('SALE_SCENE')
export class SaleScene {
  constructor(private saleUpdate: SaleUpdate) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    const keyboard = [[Markup.button.callback('🔙 Back', 'back')]];
    const message = ' sale scene';

    await editMessage(ctx, message, keyboard);
  }

  @Action('back')
  async onBack(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('WELCOME_SCENE');
  }
}
